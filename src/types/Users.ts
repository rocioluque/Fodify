export interface Address {
  address: string;
  city: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  phone?: string;
  image?: string;
  address: {
    address: string;
    street: string;
    number: string;
    city: string;
    zipcode: string;
    coordinates: { lat: string; lng: string };
    stateCode: string;
    postalCode: string;
  };
  role: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
