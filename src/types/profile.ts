export interface Profile {
  id: string;
  name: string;
  avatar: string;
  city: string;
  size: {
    height: number;
    weight: number;
    bust: number;
    waist: number;
    hip: number;
    shoeSize: number;
  };
  styles: string[];
  works: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  tags: string[];
}

export interface Review {
  id: string;
  profileId: string;
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  createTime: string;
  verified: boolean;
}
