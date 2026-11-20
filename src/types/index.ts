export type Role = "customer" | "owner" | "admin";

export type RentalType = "daily" | "weekly" | "monthly";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type BookingStatus = "confirmed" | "active" | "completed" | "cancelled";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  role: Role;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
}

export interface EquipmentOwner {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: RentalType;
  quantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: EquipmentStatus;
  featured?: boolean;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  owner?: EquipmentOwner | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  slug: string;
  label: string;
  short: string;
  description: string;
  image: string;
  count: number;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  role: string;
  comment: string;
  avatar?: string | null;
  featured?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  ownerId: string;
  ownerName: string;
  rentalStartDate: string;
  rentalEndDate: string;
  quantity: number;
  days: number;
  totalAmountCents: number;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  bookingStatus: BookingStatus;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  equipment: Equipment;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amountCents: number;
  currency: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  totalCustomers: number;
  totalEquipment: number;
  pendingApprovals: number;
  totalBookings: number;
  completedRentals: number;
  totalRevenueCents: number;
  monthly: Array<{ month: string; bookings: number; revenueCents: number }>;
}

export interface OwnerStats {
  totalEquipment: number;
  approvedEquipment: number;
  totalBookings: number;
  completedRentals: number;
  totalEarningsCents: number;
  monthly: Array<{ month: string; bookings: number; earningsCents: number }>;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
