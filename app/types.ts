export type PropertyType = 'apartment' | 'house' | 'villa' | 'condo' | 'cabin';
export type PropertyStatus = 'available' | 'occupied' | 'maintenance';
export type VendorSpecialty =
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'maintenance'
  | 'landscaping'
  | 'security';
export type VendorStatus = 'active' | 'inactive';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  nightlyRate: number;
  status: PropertyStatus;
  assignedVendorIds: string[];
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: VendorSpecialty;
  status: VendorStatus;
  assignedPropertyIds: string[];
  rating: number;
  createdAt: string;
}
