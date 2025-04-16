export interface VenueItem {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  picture: string;
  dailyrate: number;
  __v: number;
  id: string;
}

// -------------------------------
// Massage Shop
export interface MassageItem {
  _id: string;
  name: string;
  address: string;
  priceRange: string;
  phoneNumber: string;
  openTime: string;
  closeTime: string;
  __v: number;
  picture: string;
  id: string;
}

export interface MassageJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: MassageItem[];
}

export interface ReservationItem {
  _id: string;
  reservationDate: string;
  massageShop: {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    openTime: string;
    closeTime: string;
    id: string;
    picture: string;
  };
  // user: string
  user: {
    _id: string;
    name: string;
    phoneNumber: string;
    email?: string;
  };
  createdAt: string;
}
// ------------------------------
export interface TherapistJson {
  success: boolean;
  therapists: TherapistItem[];
}

export interface TherapistItem {
  _id: string;
  user: UserItem[];
  gender: string;
  age: number;
  experience: number;
  specialities: string;
  state: string;
  licenseNumber: string;
  workingInfo: WorkingInfoItem[];
  notAvailableDays: [string];
  createdAt: string;
  __v: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  __v: number;
}

export interface UserJson {
  success: boolean;
  user: UserItem[];
}

export interface WorkingInfoItem {
  massageShopID: string;
  massageShop_name: string;
  _id: string;
}
// -------------------------------

export interface VenueJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: VenueItem[];
}

export interface BookingItem {
  nameLastname: string;
  tel: string;
  venue: string;
  bookDate: string;
}
