export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostFormData {
  title: string;
  content: string;
}
