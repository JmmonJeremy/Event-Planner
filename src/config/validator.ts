import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation rules for class
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
// Validation rules for events
export const eventValidationRules = (useCase: string) => {
  return [
    // Name validation
    body("name")
      .if((value, { req }) => useCase === 'create') // Only apply this rule on creation
      .exists().withMessage("Name is required")
      .trim()
      .notEmpty().withMessage("Name cannot be empty")
      .isLength({ max: 128 }).withMessage("Name can't exceed 128 characters"),

    // Description validation
    body("description")
      .if((value, { req }) => useCase === 'create') // Only apply this rule on creation
      .exists().withMessage("Description is required")
      .trim()
      .notEmpty().withMessage("Description cannot be empty")
      .isLength({ max: 512 }).withMessage("Description can't exceed 512 characters"),

    // Date validation
    body("date")
      .if((value, { req }) => useCase === 'create') // Only apply this rule on creation
      .exists().withMessage("Date is required")
      .custom(validateDate) // Custom date validation function to check for valid formats
      .withMessage('Invalid date format'),  

    // Location validation
    body("location")
      .if((value, { req }) => useCase === 'create') // Only apply this rule on creation
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage("Location can't exceed 200 characters"),

    // Participants validation (optional for both create and update)
    body("participants")
      .optional()
      .isArray().withMessage('The field must be an array')
      .custom((value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Array cannot be empty');
        }
        if (!value.every((item: string) => typeof item === 'string' && item.trim() !== '')) {
          throw new Error('Each element in the array must be a non-empty string');
        }
        return true;
      }),
  ];
};

// Helper function to generate field-specific validation rules
const fieldValidationRules = (fieldName: string, useCase: string, maxLength: number) => {
  const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  return [
    body(fieldName)
      .if((value, { req }) => useCase === 'update')
      .optional()
      .trim()
      .notEmpty().withMessage(`${capitalizedFieldName} cannot be empty`)
      .isLength({ max: maxLength }).withMessage(`${capitalizedFieldName} can't exceed ${maxLength} characters`),
    body(fieldName)
      .if((value, { req }) => useCase === 'create')
      .exists().withMessage(`${capitalizedFieldName} is required`)
      .trim()
      .notEmpty().withMessage(`${capitalizedFieldName} cannot be empty`)
      .isLength({ max: maxLength }).withMessage(`${capitalizedFieldName} can't exceed ${maxLength} characters`),
  ];
};

// Validation rules for users
export const userValidationRules = (useCase: string) => {
  return [
    body("googleId")
      .optional()
      .matches(/^[0-9a-zA-Z]{1,255}$/).withMessage("Google ID must be alphanumeric and between 1 and 255 characters"),
    ...fieldValidationRules("name", useCase, 100),
    body("email")
      .if((value, { req }) => useCase === 'update')
      .optional()
      .trim()
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format"),
    body("email")
      .if((value, { req }) => useCase === 'create')
      .exists().withMessage("Email is required")
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

// Custom date validation
const validateDate = (value: string) => {
  const formats = [
    /^\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{2,4}\b/,
    /^\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{2,4}\b/,
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/,
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}$/
  ];

  const isValidFormat = formats.some(format => format.test(value));
  
  return isValidFormat;
};

// Validation rules for celebrations
export const celebrationValidationRules = (useCase: string) => {
  return [
    ...fieldValidationRules("person", useCase, 200),
    ...fieldValidationRules("occasion", useCase, 100),
    ...fieldValidationRules("plan", useCase, 512),
    body("user")
      .if((value, { req }) => useCase === 'create')
      .exists().withMessage("User is required")
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage("Your user was not a valid MongoDB ID"),
    body("user")
      .if((value, { req }) => useCase === 'update')
      .optional()
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage("Your user was not a valid MongoDB ID"),
    body('date')
      .if((value, { req }) => useCase === 'create')
      .exists().withMessage("Date is required")
      .custom(validateDate)
      .withMessage('Invalid date format'),  
    body('date')
      .if((value, { req }) => useCase === 'update')
      .optional()
      .custom(validateDate)
      .withMessage('Invalid date format'),  
    body('othersInvolved')
      .optional()
      .isArray().withMessage('The field must be an array')
      .custom((value) => {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Array cannot be empty');
        }
        if (!value.every((item: string) => typeof item === 'string' && item.trim() !== '')) {
          throw new Error('Each element in the array must be a non-empty string');
        }
        return true;
      }),
    body('visibility')
      .isIn(['Private', 'Public']).withMessage('Visibility must be either "Private" or "Public"')
      .optional()
      .default('Public')
  ];
};


// Validation rules for MongoDB ID
export const IDValidationRules = (idName: string) => {
  return [
    param(idName)
      .matches(/^[a-zA-Z0-9]{24}$/)
      .withMessage(`Your ${idName} was not a valid MongoDB ID`)
  ];
};

// Middleware to validate request
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

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
