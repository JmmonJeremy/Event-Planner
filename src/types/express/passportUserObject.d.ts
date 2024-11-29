// Automatically includes the properties of WrappedUser any time the Express.User type is used (i.e req.user) without need of import
import { WrappedUser } from "./wrappedUser"; // Adjust the import path

declare global {
  namespace Express {
    interface User extends WrappedUser {} // Extend the User type to match your WrappedUser
  }
}