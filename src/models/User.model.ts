export type User = {
  email: string;
  emailVerified: boolean;
  creationTime: number;
  favorites?: string[];
  photoURL: string;
  uid: string;
  recordId: string;
  displayName: string;
};
