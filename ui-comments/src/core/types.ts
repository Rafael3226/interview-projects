export type PostType = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type GeoType = {
  lat: string;
  lng: string;
};

type AddressType = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoType;
};

type CompanyType = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type UserType = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: AddressType;
  phone: string;
  website: string;
  company: CompanyType;
};

export type CommentType = {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
};
