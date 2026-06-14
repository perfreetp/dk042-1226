export type ActivityType = 'tea' | 'garden' | 'makeup' | 'market';
export type DynastyStyle = 'tang' | 'song' | 'ming' | 'han' | 'weiJin' | 'any';
export type RegisterStatus = 'registered' | 'waiting' | 'cancelled' | 'checkedIn' | 'completed';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  coverImage: string;
  city: string;
  location: string;
  date: string;
  gatherTime: string;
  dynasty: DynastyStyle;
  maxPeople: number;
  registeredPeople: number;
  waitingPeople: number;
  fee: number;
  dressCode: string;
  description: string;
  organizer: {
    name: string;
    avatar: string;
    contact: string;
  };
  tags: string[];
  album: string[];
}

export interface MyRegistration {
  id: string;
  activityId: string;
  activity: Activity;
  status: RegisterStatus;
  registerTime: string;
  checkInTime?: string;
  promotedTime?: string;
  cancelTime?: string;
}
