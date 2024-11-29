// Type that puts the user and accessToken inside the WrappedUser Object *when imported
import { IUser } from '../../models/userModel';

export interface WrappedUser {
  user: IUser;          // The user object, which adheres to the IUser interface
  accessToken: string;  // The access token string
}