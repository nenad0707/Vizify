export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  template: string;
  email?: string;
  phone?: string;
  company?: string;
  qrCode?: string;
  createdAt: string;
  isFavorite?: boolean;
}
