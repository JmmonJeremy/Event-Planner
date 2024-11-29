// Automatically provides or modifies type definitions for passport-google-oauth20 without need of import
declare module 'passport-google-oauth20' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  import { Request } from 'express';

  interface GoogleStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback?: boolean; // Allow passing req to callback
    failureRedirect?: string;   // Redirect on failure
  }

  interface GoogleProfile {
    id: string; // Google user ID
    displayName: string; // Full name
    name: {
      givenName: string; // First name
      familyName: string; // Last name
    };
    photos: { value: string }[]; // Array of profile photos
    emails: { value: string }[]; // Array of emails
    provider: 'google'; // Provider identifier
    [key: string]: any; // Catch-all for other fields
  }

  // Verify function without `req` when `passReqToCallback` is `false`
  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  // Verify function with `req` when `passReqToCallback` is `true`
  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: GoogleStrategyOptions, verify: VerifyFunction);
    constructor(options: GoogleStrategyOptions & { passReqToCallback: true }, verify: VerifyFunctionWithRequest);    
  }
}
