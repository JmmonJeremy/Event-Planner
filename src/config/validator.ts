import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

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
