export interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    __v: number,
    id: string
  }

  // -------------------------------
  // Massage Shop
  export interface MassageItem {
    _id: string,
    name: string,
    address: string,
    priceRange: string,
    phoneNumber: string,
    openTime: string,
    closeTime: string,
    __v: number,
    picture: string,
    id: string
  }

  export  interface MassageJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: MassageItem[]
  }

  // export  interface ReservationItem {
  //   nameLastname: string;
  //   tel: string;
  //   massageShop: string;
  //   reserveDate: string;
  // }

  export interface ReservationItem {
    _id: string
    reservationDate: string
    massageShop: {
      _id: string
      name: string
      address: string
      phoneNumber: string
      openTime: string
      closeTime: string
      id: string
      picture: string 
    }
    user: string
    createdAt: string
  }
  

// -------------------------------
  
export  interface VenueJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: VenueItem[]
  }

export  interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }

  