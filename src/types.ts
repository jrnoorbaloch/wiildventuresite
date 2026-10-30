export interface TicketPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  visitDate: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
}

export interface AttractionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  highlights: string[];
}

export type {
  RolePagePermissions,
  RoleOptionPermissions,
  AdminRole,
  AdminUser,
  CustomLandingSection,
  CustomPage,
  CustomPageSection,
  CustomSectionItem,
  GroupType,
  GroupBookingItem,
} from './server/defaultData';
