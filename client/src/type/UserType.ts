export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  handle: string;
  age: string;
}

export interface RetrieveUserType {
  id: number;
  handle: string;
  fullName: string;
  age: number;
  bio: string;
  profilePic: string;
  createdAt: string;
  followers: [];
  following: [];
  posts: [];
}

export interface FollowType {
  following: [];
  followers: [];
}
