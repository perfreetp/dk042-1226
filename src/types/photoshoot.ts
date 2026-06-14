export type ShootRole = 'photographer' | 'stylist' | 'model';
export type ShootStatus = 'active' | 'removed';

export interface Photoshoot {
  id: string;
  role: ShootRole;
  title: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  city: string;
  date: string;
  budget: string;
  description: string;
  style: string[];
  contact: string;
  createTime: string;
  viewCount: number;
  status?: ShootStatus;
  updateTime?: string;
  removeTime?: string;
}
