export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  createdAt?: string;
  isFavorite?: boolean;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
}
