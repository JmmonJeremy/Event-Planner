import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";




// Goal validation rules for an array of non-empty strings
export const goalValidationRules = (useCase: string) => { 

    return [ 
  
      ...fieldValidationRules("name", useCase, 100), 
  
      ...fieldValidationRules("description", useCase, 1000), 
  
      body('dueDate') 
  
        .if((value, { req }) => useCase === 'create') // For 'create' 
  
        .exists().withMessage("Date is required") // Applies only to 'create'       
  
        .custom(validateDate) // Custom date validation 
  
        .withMessage('Invalid date format'),   
  
      body('dueDate') 
  
        .if((value, { req }) => useCase === 'update') // For 'update' 
  
        .optional() // Applies only to 'update'        
  
        .custom(validateDate) // Custom date validation 
  
        .withMessage('Invalid date format'),  
  
      body("userId") 
  
        .if((value, { req }) => useCase === 'create') // For 'create' 
  
        .exists().withMessage("User is required") // Applies only to 'create'     
  
        .matches(/^[a-zA-Z0-9]{24}$/) 
  
        .withMessage(`Your user was not a valid MongoDB ID`), 
  
      body("userId") 
  
        .if((value, { req }) => useCase === 'update') // For 'update' 
  
        .optional() // Applies only to 'update'       
  
        .matches(/^[a-zA-Z0-9]{24}$/) 
  
        .withMessage(`Your user was not a valid MongoDB ID`),  
  
   
  
    ]; 
  
  }; 



export const classValidationRules = () => {
  return [
    body("startTime")
      .isISO8601()
      .toDate()
      .withMessage("Start time must be a valid date"),
    body("userId")
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage(
        "Your class doesn't belong to a real user. Find the right User ID"
      ),
  ];
};

const fieldValidationRules = (fieldName: string, useCase: string, maxLength: number) => {
  const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1); // Capitalize the first letter
  return [
    body(fieldName)
      .if((value, { req }) => useCase === 'update') // For 'update'
      .optional() // Applies only to 'update'
      .trim() 
      .notEmpty().withMessage(`${capitalizedFieldName} cannot be empty`) 
      .isLength({ max: maxLength }).withMessage(`${capitalizedFieldName} can't exceed 128 characters`),
    body(fieldName)
      .if((value, { req }) => useCase === 'create') // For 'create'
      .exists().withMessage(`${capitalizedFieldName} is required`) // Applies only to 'create'
      .trim()
      .notEmpty().withMessage(`${capitalizedFieldName} cannot be empty`)
      .isLength({ max: maxLength }).withMessage(`${capitalizedFieldName} can't exceed 128 characters`),
  ];
};

export const userValidationRules = (useCase: string) => {
  return [
    body("googleId")
      .optional()
      .matches(/^[0-9a-zA-Z]{1,255}$/).withMessage("Google ID must be alphanumeric and between 1 and 255 characters"),
    ...fieldValidationRules("name", useCase, 100),
    body("email")
      .if((value, { req }) => useCase === 'update') // For 'update'
      .optional() // Applies only to 'update'
      .trim()    
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format"),
    body("email")
      .if((value, { req }) => useCase === 'create') // For 'create'
      .exists().withMessage("Email is required") // Applies only to 'create'
      .trim()    
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format"),
  
    body("password")
      .optional()
      .trim()
      .notEmpty().withMessage("Email is required")
      .isLength({ min: 6, max: 128 }).withMessage("Password must be between 6 and 128 characters long")
      .matches(/^\S*$/).withMessage("Password must not contain spaces")
      .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")    
  ];
};

const validateDate = (value: string) => {
  const formats = [
    /^\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{2,4}\b/, // Example: Dec 12, 2024
    /^\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{2,4}\b/, // Example: December 12, 2024
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/, // Example: 12/12/2024 or 12-12-2024
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}$/, // Example: 12/12/24 or 12-12-24
  ];

  const isValidFormat = formats.some(format => format.test(value));
  
  if (!isValidFormat) {
    return false;  // Return false to indicate validation failure
  }

  return true; // Return true if valid
};

export const celebrationValidationRules = (useCase: string) => {
  return [
    ...fieldValidationRules("person", useCase, 200),
    ...fieldValidationRules("occasion", useCase, 100),
    ...fieldValidationRules("plan", useCase, 512),
    body("user")
      .if((value, { req }) => useCase === 'create') // For 'create'
      .exists().withMessage("User is required") // Applies only to 'create'    
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage(`Your user was not a valid MongoDB ID`),
    body("user")
      .if((value, { req }) => useCase === 'update') // For 'update'
      .optional() // Applies only to 'update'      
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage(`Your user was not a valid MongoDB ID`), 
    body('date')
      .if((value, { req }) => useCase === 'create') // For 'create'
      .exists().withMessage("Date is required") // Applies only to 'create'      
      .custom(validateDate) // Custom date validation
      .withMessage('Invalid date format'),  
    body('date')
      .if((value, { req }) => useCase === 'update') // For 'update'
      .optional() // Applies only to 'update'       
      .custom(validateDate) // Custom date validation
      .withMessage('Invalid date format'),  
    // Validator for an array of strings
    body('othersInvolved')
      .optional()
      .isArray().withMessage('The field must be an array')  // Check if it's an array
      .custom((value) => {
        // Check if the array is not empty
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Array cannot be empty');
        }
        // Check if all elements in the array are strings
        if (!value.every((item: string) => typeof item === 'string' && item.trim() !== '')) {
          throw new Error('Each element in the array must be a non-empty string');
        }
        return true;
      }),
    body('visibility')
      .isIn(['Private', 'Public']).withMessage('Visibility must be either "Private" or "Public"')
      .optional() // optional because it has a default value
      .default('Public') // setting default value if not provided
  ];
};

// A validator for whether an ID is a valid MongoDB Id. Pass the name of the parameter which should be a MongoDB Id
export const IDValidationRules = (idName : string) => {
  return [
    param(idName)
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage(`Your ${idName} was not a valid MongoDB ID`),
  ]
}

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  // If validation succeeded, move to next middleware. Otherwise, return a list of failures.
  if (errors.isEmpty()) {
    next();
  } else {
    const extractedErrors: Array<object> = errors.array().map((err) => {
      return { [err.type]: err.msg };
    });

    res.status(412).json({
      errors: extractedErrors,
    });
  }
};
