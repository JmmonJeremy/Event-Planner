import { Request, Response, NextFunction } from 'express';
// logout & destroy session records - leading to login page
export const logOut = (req: Request, res: Response, next: NextFunction): void => {
  /* #swagger.security = [{ "bearerAuth": [] }] */
  /* #swagger.summary = "DELETES ---(OAUTH AUTHORIZATION)--- for the user" */ 
  /* #swagger.description = 'After DELETING AUTHORIZATION of the user it returns a success code and redirects the user to the LOGIN PAGE.' */
  // #swagger.responses[200] = { description: 'SUCCESS, the OAUTH AUTORIZATION was DELETED' } 
  req.logout((error: unknown) => { //clears the session on your app’s side
    if (error) { return next(error); }
    req.session.destroy((err: unknown) => { //completely remove the session data
      if (err) { return next(err); }
      res.status(200).redirect('/');
    });
  });
};