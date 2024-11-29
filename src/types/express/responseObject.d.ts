// To  inform TypeScript that locals exists and is valid to use  without need of import
declare global {
  namespace Express {
    interface Response {
      locals: {
        success_msg: string | string[];
        error_msg: string | string[];
        error: string | string[];
      };
    }
  }
}