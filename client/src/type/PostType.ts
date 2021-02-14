export interface RetrievePostType {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  creator: {
    handle: string;
    fullName: string;
    profilePic: string;
  };
  upvotes: [];
  comments: [];
}

export interface UpvoteType {
  id: number;
  title: string;
  upvotes: [];
}
