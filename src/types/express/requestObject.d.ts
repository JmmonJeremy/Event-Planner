// To  inform TypeScript that req.logIn exists and is valid to use  without need of import
declare namespace Express {
  interface Request {
    logIn: (user: any, callback?: (err: any) => void) => void;
    user?: IUser; // Make sure this matches your User model
    user?: IUser & { id: string }; // Assuming `id` is the user's `_id` in string form
    accessToken?: string;
  }
}