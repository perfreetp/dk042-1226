import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Photoshoot, ShootRole } from '@/types/photoshoot';
import { photoshoots as mockPhotoshoots } from '@/data/photoshoots';

interface PhotoshootState {
  photoshoots: Photoshoot[];
  addPhotoshoot: (data: Omit<Photoshoot, 'id' | 'createTime' | 'viewCount' | 'author'> & { authorName: string }) => { success: boolean; message: string; id: string };
  updatePhotoshoot: (id: string, data: Partial<Photoshoot>) => { success: boolean; message: string };
  removePhotoshoot: (id: string) => { success: boolean; message: string };
  relistPhotoshoot: (id: string) => { success: boolean; message: string };
  incrementView: (id: string) => void;
  getPhotoshootsByRole: (role: ShootRole | 'all', showRemoved?: boolean) => Photoshoot[];
  getMyPhotoshoots: () => Photoshoot[];
  getPhotoshootById: (id: string) => Photoshoot | undefined;
  isMyPhotoshoot: (id: string) => boolean;
}

const myUserId = 'me';

export const usePhotoshootStore = create<PhotoshootState>()(
  persist(
    (set, get) => ({
      photoshoots: mockPhotoshoots,

      addPhotoshoot: (data) => {
        const newPhotoshoot: Photoshoot = {
          id: `p_${Date.now()}`,
          role: data.role,
          title: data.title,
          coverImage: data.coverImage,
          author: {
            id: myUserId,
            name: data.authorName || '我',
            avatar: 'https://picsum.photos/id/64/200/200'
          },
          city: data.city,
          date: data.date,
          budget: data.budget,
          description: data.description,
          style: data.style,
          contact: data.contact,
          createTime: new Date().toLocaleString('zh-CN'),
          viewCount: 0,
          status: 'active'
        };

        set({
          photoshoots: [newPhotoshoot, ...get().photoshoots]
        });

        return { success: true, message: '发布成功', id: newPhotoshoot.id };
      },

      updatePhotoshoot: (id: string, data: Partial<Photoshoot>) => {
        const state = get();
        const p = state.photoshoots.find(x => x.id === id);
        if (!p) return { success: false, message: '约拍不存在' };
        if (p.author.id !== myUserId) return { success: false, message: '只能编辑自己发布的内容' };

        set({
          photoshoots: state.photoshoots.map(x =>
            x.id === id ? { ...x, ...data, updateTime: new Date().toLocaleString('zh-CN') } : x
          )
        });

        return { success: true, message: '修改成功' };
      },

      removePhotoshoot: (id: string) => {
        const state = get();
        const p = state.photoshoots.find(x => x.id === id);
        if (!p) return { success: false, message: '约拍不存在' };
        if (p.author.id !== myUserId) return { success: false, message: '只能下架自己发布的内容' };

        set({
          photoshoots: state.photoshoots.map(x =>
            x.id === id ? { ...x, status: 'removed', removeTime: new Date().toLocaleString('zh-CN') } : x
          )
        });

        return { success: true, message: '已下架' };
      },

      relistPhotoshoot: (id: string) => {
        const state = get();
        const p = state.photoshoots.find(x => x.id === id);
        if (!p) return { success: false, message: '约拍不存在' };
        if (p.author.id !== myUserId) return { success: false, message: '只能上架自己发布的内容' };
        if (p.status !== 'removed') return { success: false, message: '该内容未下架' };

        set({
          photoshoots: state.photoshoots.map(x =>
            x.id === id ? { ...x, status: 'active', updateTime: new Date().toLocaleString('zh-CN'), removeTime: undefined } : x
          )
        });

        return { success: true, message: '已重新上架' };
      },

      incrementView: (id: string) => {
        set({
          photoshoots: get().photoshoots.map(p =>
            p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
          )
        });
      },

      getPhotoshootsByRole: (role: ShootRole | 'all', showRemoved = false) => {
        let list = get().photoshoots.filter(p => showRemoved || p.status !== 'removed');
        if (role !== 'all') list = list.filter(p => p.role === role);
        return list;
      },

      getMyPhotoshoots: () => {
        return get().photoshoots.filter(p => p.author.id === myUserId);
      },

      getPhotoshootById: (id: string) => {
        return get().photoshoots.find(p => p.id === id);
      },

      isMyPhotoshoot: (id: string) => {
        const p = get().getPhotoshootById(id);
        return p ? p.author.id === myUserId : false;
      }
    }),
    {
      name: 'hanfu-photoshoot-storage'
    }
  )
);
