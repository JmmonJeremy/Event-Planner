// Automatically provides or modifies type definitions for passport-local without need of import
declare module 'passport-local' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
 
  //  * Options for configuring the LocalStrategy.
  export interface LocalStrategyOptions {
    usernameField?: string; // Field name for username (defaults to 'username')
    passwordField?: string; // Field name for password (defaults to 'password')
    passReqToCallback?: boolean; // Pass req as the first argument to the verify callback
  }

  //  * Verify function without `req`.
  export type VerifyFunction = (
    email: string, // Updated to use email instead of username
    password: string,
    done: (error: any, user?: any, options?: any) => void
  ) => void;

  //  * Verify function with `req`.
  export type VerifyFunctionWithRequest = (
    req: Express.Request,
    email: string, // Updated to use email instead of username
    password: string,
    done: (error: any, user?: any, options?: any) => void
  ) => void;

  //  * LocalStrategy class.
  export class Strategy extends PassportStrategy {
    constructor(options: LocalStrategyOptions, verify: VerifyFunction);
    constructor(
      options: LocalStrategyOptions & { passReqToCallback: true },
      verify: VerifyFunctionWithRequest
    );
    name: string;
  }
}
