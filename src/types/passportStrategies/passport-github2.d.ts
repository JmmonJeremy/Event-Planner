// Automatically provides or modifies type definitions for passport-github2 without need of import
declare module 'passport-github2' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  import { Request } from 'express';

  export interface GitHubProfile {
    id: string;
    username: string;
    displayName: string;
    profileUrl: string;
    photos: { value: string }[];
    provider: 'github';
    _json: {
      login: string;
      id: number;
      avatar_url: string;
      html_url: string;  
      // Declaring the fields below directly in the _json object makes it clear 
      // & helps prevent subtle bugs if the fields are misspelled or unavailable
      bio?: string;      // Optional bio field
      location?: string; // Optional location field
      company?: string;  // Optional company field
      blog?: string;     // Optional blog/website field
      [key: string]: any;
    };
  }

  // Extend GitHubProfile to include an 'emails' property
  export interface GitHubProfile {
    emails?: { value: string }[]; // Define the structure for emails
  }

  export interface GitHubStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    state?: boolean;
    customHeaders?: Record<string, string>;
    passReqToCallback?: boolean; // Allow passing req to callback
    failureRedirect?: string;   // Redirect on failure
  }

  // Verify function without `req` when `passReqToCallback` is `false`
  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  // Verify function with `req` when `passReqToCallback` is `true`
  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: GitHubStrategyOptions, verify: VerifyFunction);
    constructor(
      options: GitHubStrategyOptions & { passReqToCallback: true },
      verify: VerifyFunctionWithRequest
    );
    name: string;
  }
}
