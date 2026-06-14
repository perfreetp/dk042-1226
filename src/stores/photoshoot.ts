import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Photoshoot, ShootRole } from '@/types/photoshoot';
import { photoshoots as mockPhotoshoots } from '@/data/photoshoots';

interface PhotoshootState {
  photoshoots: Photoshoot[];
  addPhotoshoot: (data: Omit<Photoshoot, 'id' | 'createTime' | 'viewCount' | 'author'> & { authorName: string }) => { success: boolean; message: string; id: string };
  getPhotoshootsByRole: (role: ShootRole | 'all') => Photoshoot[];
  getPhotoshootById: (id: string) => Photoshoot | undefined;
}

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
            id: 'me',
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
          viewCount: 0
        };

        set({
          photoshoots: [newPhotoshoot, ...get().photoshoots]
        });

        return { success: true, message: '发布成功', id: newPhotoshoot.id };
      },

      getPhotoshootsByRole: (role: ShootRole | 'all') => {
        if (role === 'all') return get().photoshoots;
        return get().photoshoots.filter(p => p.role === role);
      },

      getPhotoshootById: (id: string) => {
        return get().photoshoots.find(p => p.id === id);
      }
    }),
    {
      name: 'hanfu-photoshoot-storage'
    }
  )
);
