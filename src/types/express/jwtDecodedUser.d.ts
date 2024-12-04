declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}