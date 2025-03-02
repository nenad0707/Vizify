export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  email?: string;
  phone?: string;
  company?: string;
  createdAt?: string;
  qrCode?: string;
  isFavorite?: boolean;
  tags?: string[];
}
