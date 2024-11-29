import express, { Express, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json"; // Path to the generated Swagger JSON file
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database"; 
import routes from "./routes"; 
import flash from 'connect-flash';
import morgan from 'morgan';
import path from "path"; // Import path module for file paths
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PassportStatic } from 'passport';
import session from 'express-session';
import { engine }from 'express-handlebars'; // If you're using v6 or higher
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';

dotenv.config();

const app: Express = express();

// Set trust proxy
app.set('trust proxy', 1); // Trust the first proxy (required for Render's setup)

// Global Uncaught Exception Handler (This acts as a safety net for errors that occur outside of promise chains 
// and are not caught anywhere in the code.) (Exceptions 1st because they are a more critical type of error)
process.on("uncaughtException", (error: Error, origin: string) => {
  console.error(`Caught exception: ${error.message}\nException origin: ${origin}`);
  process.exit(1); // Exiting is recommended to avoid an unstable state
});

// Handle unhandled promise rejections (It is a Node.js process-level event. Place after dotenv.config(), 
// but before any other application logic. It should not be placed within the Express middleware stack)
process.on("unhandledRejection", (reason: unknown, promise: Promise<any>) => {
  console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
});

// Middleware
app.use(cookieParser());

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public'))); // This will serve files from 'public' folder

// Method override from: https://www.npmjs.com/package/method-override
app.use(methodOverride((req: Request, res: Response): string => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // Look for '_method' in urlencoded POST bodies and delete it
    const method = req.body._method as string;
    delete req.body._method;
    return method;
  }
  return "methodOverride is undefined";
}));

// Passport initialization
require('./config/passport')(passport as PassportStatic);

// Ensure that SESSION_SECRET is defined and is a string
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not defined!');
}

// Sessions middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  // from https://www.npmjs.com/package/connect-mongo
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {   
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
    httpOnly: true,  // Prevents access to the cookie via JavaScript (XSS protection)
    // sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 1 day (adjust if needed)
  }   
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use connect-flash middleware
app.use(flash());

// Middleware to pass flash messages to templates (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware to save accessToken to session
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.accessToken) {
    req.accessToken = req.user.accessToken;
    req.user = req.user.user as Express.User;; // redefine req.user to only contain the user object 
  }
  next();
});

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set global variable middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user || null;  // used for editIcon function
  res.locals.req = req;  // Make `req` accessible in all Handlebars templates
  next();
});

// Handlebars Helpers
import { formatDate, stripTags, truncate, editIcon, select, getMonth, getDay, getYear, goBack, log } from './helpers/hbs';

/// Register Handlebars engine with helpers
app.engine('.hbs', engine({
  helpers: { 
    formatDate, 
    stripTags, 
    truncate, 
    editIcon, 
    select, 
    getMonth, 
    getDay, 
    getYear, 
    goBack, 
    log 
  },
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');


// CORS setup    (Order #5)(OLD ORDER #2)
app.use(cors({
  origin: 'https://event-planner-nkma.onrender.com/', 
  credentials: true // Allow cookies to be sent
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB and start the server 
// (wrapped in an async function to simplify structure and improve clarity )
(async () => {
  try {
    await connectDB();
    console.log("Database connected.");

    // Routes
    // app.get("/", (req: Request, res: Response) => {
    //   res.send("Welcome to the API! Documentation available at /api-docs");
    // });
    app.use("/", routes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Global error handler (Placing below routes ensures the error handler is the last middleware in the stack,
    // Placing before app.listen ensures server setup is completed & errors are handled properly.)
    app.use((err: Error, req: Request, res: Response, next: Function) => {
      console.error(err.stack);
      res.status(500).send({ message: "Something went wrong!" });
    });
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Failed to connect to the database. Server not started:", err.message);
      console.error("Error stack trace:", err.stack); // Log the stack trace for debugging
    } else {
      console.error("An unknown error occurred."); // Fallback for non-Error exceptions
    }
    process.exit(1); // Ensure the application exits
  }
})();
