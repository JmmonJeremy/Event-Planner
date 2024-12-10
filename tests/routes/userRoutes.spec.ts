import request from "supertest";
const mockingoose = require("mockingoose");
import express, { Request, Response, NextFunction } from "express";
import UserModel from "../../src/models/userModel";
import routes from "../../src/routes";

const app = express();
app.use(express.json());
app.use("/", routes);

describe("User Routes", () => {
// #1 Get all users tests ****************************************************************************
  describe("GET /users", () => {
    // Setup mocked response.
    mockingoose(UserModel).toReturn([{ name: "John Doe", email: "example@example.com" }], "find");
    // Test success case for getting all users from the database
    test("Should return all users from database", async () => {   
      const res = await request(app).get("/users"); 
      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject([{
        _id: expect.any(String),  // Allow any string for _id
        name: "John Doe",
        email: "example@example.com",
      }]);
    });
  });

// #2 Get specific user tests ***********************************************************************
  describe("GET /user/:userId", () => {
    // Setup mocked response.
    mockingoose(UserModel).toReturn({ name: "John Doe", email: "example@example.com" }, "findOne");
    // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid Id Param", async () => {   
      const res = await request(app).get("/user/incorrectLengthForUserMongoDBObjctId");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    // Test success case for getting a specific user from the database
    test("Should return user from database", async () => {          
      const res = await request(app).get("/user/mockedUserMongoDBObjctId");
      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        name: "John Doe",
        email: "mock@example.com",
      });
    });
  });
        
// #3 Post/create a new user tests ************************************************************
  describe("POST /user", () => {
    // Setup mocked response.
    const mockedUser = {
      googleId: "111989098722327618136",
      name: "John Doe",
      email: "mock@example.com",
      password: "mockYour#1password"
    };    
    mockingoose(UserModel).toReturn(mockedUser, "save");  
    // Test invalid inputs using test.each for better reusability
    const invalidInputs = [
      { testNameEnding: 'an invalid googleId', field: 'googleId', value: '190-no-dashes-allowed', expectedStatus: 412 },
      { testNameEnding: 'an empty name',field: 'name', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an invalid email format',field: 'email', value: 'emailWithNoAtSomewhere', expectedStatus: 412 },
      { testNameEnding: 'spaces in the password',field: 'password', value: 'pass word', expectedStatus: 412 }, // spaces
      { testNameEnding: 'a password with less than 6 characters',field: 'password', value: '#1Pwd', expectedStatus: 412 }, // less than 6 chars
      { testNameEnding: 'passwords without a lowercase letter',field: 'password', value: '#1PASSWORD', expectedStatus: 412 }, // no lowercase
      { testNameEnding: 'passwords without an uppercase letter',field: 'password', value: '#1password', expectedStatus: 412 }, // no uppercase
      { testNameEnding: 'passwords without a number',field: 'password', value: '#password', expectedStatus: 412 }, // no number
      { testNameEnding: 'passwords without a special character',field: 'password', value: '1Password', expectedStatus: 412 }, // no special character
    ];  
    test.each(invalidInputs)(
      "Shouldn't allow $testNameEnding",
      async ({ field, value, expectedStatus }) => {
        const res = await request(app).post("/user").send({ ...mockedUser, [field]: value });
        // Assert
        expect(res.statusCode).toBe(expectedStatus);
      }
    );  
    // Test success case for posting user to the database
    test("Should post user to the database", async () => {
      const res = await request(app).post("/user").send(mockedUser);  
      // Assert
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body._id).toMatch(/^[a-zA-Z0-9]{24}$/);
    });
  });

// #4 Put/alter a user tests ******************************************************************
  describe("PUT /user", () => {
    // Setup mocked response.    
    const mockedUser = {
      googleId: "222989098722327618222",
      name: "Jane Doe",
      email: "mockHer@example.com",
      password: "mockHer#1password"
    }; 
    mockingoose(UserModel).toReturn({ _id: "mockedUserMongoDBObjctId", ...mockedUser }, "findOneAndUpdate"); // Mock update method;
    // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid userId in params", async () => {     
      const res = await request(app).put("/user/incorrectChars -$ForObId").send({}); 
      // Assert    
      expect(res.statusCode).toBe(412);
    });
    // Test invalid inputs using test.each for better reusability
    const invalidInputs = [
      { testNameEnding: 'an invalid googleId', field: 'googleId', value: '190-no-dashes-allowed', expectedStatus: 412 },
      { testNameEnding: 'an empty name',field: 'name', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an invalid email format',field: 'email', value: 'emailWithNoAtSomewhere', expectedStatus: 412 },
      { testNameEnding: 'spaces in the password',field: 'password', value: 'pass word', expectedStatus: 412 }, // spaces
      { testNameEnding: 'a password with less than 6 characters',field: 'password', value: '#1Pwd', expectedStatus: 412 }, // less than 6 chars
      { testNameEnding: 'passwords without a lowercase letter',field: 'password', value: '#1PASSWORD', expectedStatus: 412 }, // no lowercase
      { testNameEnding: 'passwords without an uppercase letter',field: 'password', value: '#1password', expectedStatus: 412 }, // no uppercase
      { testNameEnding: 'passwords without a number',field: 'password', value: '#password', expectedStatus: 412 }, // no number
      { testNameEnding: 'passwords without a special character',field: 'password', value: '1Password', expectedStatus: 412 }, // no special character
    ];  
    test.each(invalidInputs)(
      "Shouldn't allow $testNameEnding",
      async ({ field, value, expectedStatus }) => {
        const res = await request(app).put("/user/mockedUserMongoDBObjctId").send({ ...mockedUser, [field]: value });
        // Assert
        expect(res.statusCode).toBe(expectedStatus);
      }
    );  
    // Test success case for updating user in the database
    test("Should update user to the database", async () => {
      const res = await request(app).put("/user/mockedUserMongoDBObjctId").send(mockedUser);
      // Assert  
      expect(res.statusCode).toBe(204);    
    });
  });

// #4 Delete a user tests *********************************************************************
  describe("DELETE /user/:userId", () => {
    // Setup mocked response.
    mockingoose(UserModel).toReturn({ _id: "mockedUserMongoDBObjctId" }, "findOneAndDelete");
    // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid Id Param", async () => {    
      const res = await request(app).delete("/user/incorrectChars_.!ForObId");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    // Test success case for deleting a user from the database
    test("Should delete user from database", async () => {    
      const res = await request(app).delete("/user/mockedUserMongoDBObjctId");
      // Assert
      expect(res.statusCode).toBe(200);
    });
    // Test case for not finding the user in the database
    test("Should inform if there already was no user by that Id in the database", async () => {
      // Setup mocked response.
      mockingoose(UserModel).toReturn(null, "findOneAndDelete");      
      const res = await request(app).delete("/user/missingUserMongoDBObjtId");
      // Assert
      expect(res.statusCode).toBe(404);
    });
  });



});