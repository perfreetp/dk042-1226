import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';
import { Activity, MyRegistration, RegisterStatus } from '@/types/activity';
import { activities as mockActivities, myRegistrations as mockRegistrations } from '@/data/activities';

interface ActivityState {
  activities: Activity[];
  registrations: MyRegistration[];
  _init: boolean;
  initState: () => void;
  registerActivity: (activityId: string) => { success: boolean; message: string };
  joinWaiting: (activityId: string) => { success: boolean; message: string };
  cancelRegistration: (registrationId: string) => { success: boolean; message: string };
  checkIn: (registrationId: string) => { success: boolean; message: string };
  uploadAlbum: (activityId: string, imageUrl: string) => { success: boolean; message: string };
  getRegistrationByActivityId: (activityId: string) => MyRegistration | undefined;
  getRegistrationStatus: (activityId: string) => RegisterStatus | 'none';
  archiveCompleted: () => void;
  processWaitingQueue: (activityId: string) => { promoted: number };
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: mockActivities,
      registrations: mockRegistrations,
      _init: false,

      initState: () => {
        const state = get();
        if (state._init) return;
        const archived = state.archiveCompleted();
        set({ _init: true });
        return archived;
      },

      registerActivity: (activityId: string) => {
        const state = get();
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity) return { success: false, message: '活动不存在' };

        const existingReg = state.registrations.find(
          r => r.activityId === activityId && r.status !== 'cancelled'
        );
        if (existingReg) return { success: false, message: '您已报名或候补该活动' };

        if (activity.registeredPeople >= activity.maxPeople) {
          return { success: false, message: '活动名额已满，请加入候补' };
        }

        const newReg: MyRegistration = {
          id: `reg_${Date.now()}`,
          activityId: activity.id,
          activity: { ...activity, registeredPeople: activity.registeredPeople + 1 },
          status: 'registered',
          registerTime: new Date().toLocaleString('zh-CN')
        };

        set({
          activities: state.activities.map(a =>
            a.id === activityId
              ? { ...a, registeredPeople: a.registeredPeople + 1 }
              : a
          ),
          registrations: [...state.registrations, newReg].map(r =>
            r.activityId === activityId && r.status !== 'cancelled'
              ? { ...r, activity: { ...r.activity, registeredPeople: r.activity.registeredPeople + 1 } }
              : r
          )
        });

        return { success: true, message: '报名成功' };
      },

      joinWaiting: (activityId: string) => {
        const state = get();
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity) return { success: false, message: '活动不存在' };

        const existingReg = state.registrations.find(
          r => r.activityId === activityId && r.status !== 'cancelled'
        );
        if (existingReg) return { success: false, message: '您已报名或候补该活动' };

        const waitingList = state.registrations
          .filter(r => r.activityId === activityId && r.status === 'waiting')
          .sort((a, b) => a.registerTime.localeCompare(b.registerTime));

        const newReg: MyRegistration = {
          id: `reg_${Date.now()}`,
          activityId: activity.id,
          activity: { ...activity, waitingPeople: activity.waitingPeople + 1 },
          status: 'waiting',
          registerTime: new Date().toLocaleString('zh-CN')
        };

        set({
          activities: state.activities.map(a =>
            a.id === activityId
              ? { ...a, waitingPeople: a.waitingPeople + 1 }
              : a
          ),
          registrations: [...state.registrations, newReg].map(r =>
            r.activityId === activityId && r.status !== 'cancelled'
              ? { ...r, activity: { ...r.activity, waitingPeople: r.activity.waitingPeople + 1 } }
              : r
          )
        });

        return { success: true, message: waitingList.length > 0 ? `候补成功，当前排第${waitingList.length + 1}位` : '候补成功' };
      },

      processWaitingQueue: (activityId: string) => {
        const state = get();
        let promoted = 0;
        let activities = [...state.activities];
        let registrations = [...state.registrations];
        const activityIdx = activities.findIndex(a => a.id === activityId);
        if (activityIdx === -1) return { promoted: 0 };

        let activity = { ...activities[activityIdx] };

        while (activity.registeredPeople < activity.maxPeople) {
          const waitingList = registrations
            .filter(r => r.activityId === activityId && r.status === 'waiting')
            .sort((a, b) => a.registerTime.localeCompare(b.registerTime));

          if (waitingList.length === 0) break;

          const firstWaiting = waitingList[0];
          registrations = registrations.map(r => {
            if (r.id === firstWaiting.id) {
              return { ...r, status: 'registered' as RegisterStatus };
            }
            return r;
          });

          activity = {
            ...activity,
            registeredPeople: activity.registeredPeople + 1,
            waitingPeople: Math.max(0, activity.waitingPeople - 1)
          };
          promoted++;
        }

        activities[activityIdx] = activity;
        registrations = registrations.map(r =>
          r.activityId === activityId && r.status !== 'cancelled'
            ? { ...r, activity }
            : r
        );

        if (promoted > 0) {
          set({ activities, registrations });
        }

        return { promoted };
      },

      cancelRegistration: (registrationId: string) => {
        const state = get();
        const reg = state.registrations.find(r => r.id === registrationId);
        if (!reg) return { success: false, message: '报名记录不存在' };

        const isWaiting = reg.status === 'waiting';
        const activityId = reg.activityId;

        let newRegistrations = state.registrations.map(r =>
          r.id === registrationId
            ? { ...r, status: 'cancelled' as RegisterStatus }
            : r
        );

        let newActivities = state.activities.map(a =>
          a.id === activityId
            ? isWaiting
              ? { ...a, waitingPeople: Math.max(0, a.waitingPeople - 1) }
              : { ...a, registeredPeople: Math.max(0, a.registeredPeople - 1) }
            : a
        );

        newRegistrations = newRegistrations.map(r =>
          r.activityId === activityId && r.status !== 'cancelled'
            ? {
                ...r,
                activity: {
                  ...r.activity,
                  registeredPeople: isWaiting ? r.activity.registeredPeople : Math.max(0, r.activity.registeredPeople - 1),
                  waitingPeople: isWaiting ? Math.max(0, r.activity.waitingPeople - 1) : r.activity.waitingPeople
                }
              }
            : r
        );

        set({ activities: newActivities, registrations: newRegistrations });

        if (!isWaiting) {
          setTimeout(() => {
            const result = get().processWaitingQueue(activityId);
            if (result.promoted > 0) {
              Taro.showToast({
                title: `候补用户已自动转正${result.promoted}人`,
                icon: 'none',
                duration: 2000
              });
            }
          }, 500);
        }

        return { success: true, message: '已取消报名' };
      },

      checkIn: (registrationId: string) => {
        const state = get();
        const reg = state.registrations.find(r => r.id === registrationId);
        if (!reg) return { success: false, message: '报名记录不存在' };
        if (reg.status !== 'registered') return { success: false, message: '当前状态无法签到' };

        set({
          registrations: state.registrations.map(r =>
            r.id === registrationId
              ? {
                  ...r,
                  status: 'checkedIn' as RegisterStatus,
                  checkInTime: new Date().toLocaleString('zh-CN')
                }
              : r
          )
        });

        return { success: true, message: '签到成功' };
      },

      uploadAlbum: (activityId: string, imageUrl: string) => {
        const state = get();
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity) return { success: false, message: '活动不存在' };

        const newAlbum = [imageUrl, ...activity.album];

        set({
          activities: state.activities.map(a =>
            a.id === activityId ? { ...a, album: newAlbum } : a
          ),
          registrations: state.registrations.map(r =>
            r.activityId === activityId
              ? { ...r, activity: { ...r.activity, album: newAlbum } }
              : r
          )
        });

        return { success: true, message: '上传成功' };
      },

      archiveCompleted: () => {
        const state = get();
        const today = dayjs();
        let changed = false;

        const updatedRegistrations = state.registrations.map(r => {
          const activityDate = dayjs(r.activity.date + ' ' + r.activity.gatherTime);
          const isPast = activityDate.isBefore(today);
          if (isPast && (r.status === 'checkedIn' || r.status === 'registered')) {
            changed = true;
            return { ...r, status: 'completed' as RegisterStatus };
          }
          return r;
        });

        if (changed) {
          set({ registrations: updatedRegistrations });
        }

        return { changed };
      },

      getRegistrationByActivityId: (activityId: string) => {
        const state = get();
        return state.registrations.find(
          r => r.activityId === activityId && r.status !== 'cancelled'
        );
      },

      getRegistrationStatus: (activityId: string): RegisterStatus | 'none' => {
        const reg = get().getRegistrationByActivityId(activityId);
        return reg ? reg.status : 'none';
      }
    }),
    {
      name: 'hanfu-activity-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            state.archiveCompleted();
            state._init = true;
          }, 300);
        }
      }
    }
  )
);
