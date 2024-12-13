import request from "supertest";
const mockingoose = require("mockingoose");
import express, { Request, Response, NextFunction } from "express";
import CelebrationModel from "../../src/models/celebrationModel";
import routes from "../../src/routes";

const app = express();
app.use(express.json());
app.use("/", routes);

// Function to turn the date into the correct format for a match with database
function convertToISOString(dateString: string): string {
  // Parse the input date string into a Date object
  const date = new Date(dateString);
  // Add 8 hours (assuming the desired offset) and return the ISO string
  date.setUTCHours(date.getUTCHours());
  return date.toISOString();
}

describe("Celebration Routes -JT", () => {
// #1 Get all of a user's celebrations tests ****************************************************************************
  describe("GET /celebrations/user/:userId", () => {
    // Setup mocked response.
    mockingoose(CelebrationModel).toReturn([{ 
        _id: "Ce1FaceDa7aBa5e1dD00b1ed",
        person: "Mocked Person", 
        occasion: "Mocked Celebration", 
        plan: "Mocked Plan", 
        user: "FabFaceDa7aba5e1dD00b1ed", 
        date: "Dec 18, 2024",
        location: "Mocked Location",
        othersInvolved: ["Mocked Other1", "Mocked Other2"],
        visibility: "Public"
      }], "find");
      // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid Id Param", async () => {   
      const res = await request(app).get("/celebrations/user/incorrectLengthForUserMongoDBObjctId");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    // Test success case for getting all of a user's celebrations from the database
    test("Should return all of a user's celebrations from the database", async () => {   
      const res = await request(app).get("/celebrations/user/FabFaceDa7aba5e1dD00b1ed"); 
      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject([{
        _id: expect.any(String), 
        person: "Mocked Person", 
        occasion: "Mocked Celebration", 
        plan: "Mocked Plan", 
        user: "fabfaceda7aba5e1dd00b1ed", // Match the lowercase version
        date: convertToISOString("Dec 18, 2024"), // Match ISO format,
        location: "Mocked Location",
        othersInvolved: ["Mocked Other1", "Mocked Other2"],
        visibility: "Public"
      }]);
    });
  });

 // #2 Get specific celebration tests ***********************************************************************
  describe("GET /celebrations/:celebrationId", () => {
    // Setup mocked response.
    mockingoose(CelebrationModel).toReturn({  
        _id: "Ce1FaceDa7aBa5e1dD00b1ed",      
        person: "Mocked Person", 
        occasion: "Mocked Celebration", 
        plan: "Mocked Plan", 
        user: "FabFaceDa7aba5e1dD00b1ed", 
        date: "Dec 18, 2024",
        location: "Mocked Location",
        othersInvolved: ["Mocked Other1", "Mocked Other2"],
        visibility: "Public"
      }, "findOne");
    // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid Id Param", async () => {   
      const res = await request(app).get("/celebrations/incorrectLengthForUserMongoDBObjctId");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    // Test success case for getting a specific celebration from the database
    test("Should return celebration from database", async () => {          
      const res = await request(app).get("/celebrations/Ce1FaceDa7aBa5e1dD00b1ed");
      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        _id: "ce1faceda7aba5e1dd00b1ed", // Match the lowercase version
        person: "Mocked Person", 
        occasion: "Mocked Celebration", 
        plan: "Mocked Plan", 
        user: "fabfaceda7aba5e1dd00b1ed", // Match the lowercase version
        date: convertToISOString("Dec 18, 2024"), // Match ISO format,
        location: "Mocked Location",
        othersInvolved: ["Mocked Other1", "Mocked Other2"],
        visibility: "Public"
      });
    });
  });

  // #3 Post/create a new celebration tests ************************************************************
  describe("POST /celebrations", () => {
    // Setup mocked response.
    const mockedCelebration = {
      person: "Mocked Person", 
      occasion: "Mocked Celebration", 
      plan: "Mocked Plan", 
      user: "FabFaceDa7aba5e1dD00b1ed",
      date: "Dec 18, 2024", 
      location: "Mocked Location",
      othersInvolved: ["Mocked Other1", "Mocked Other2"],
      visibility: "Public"
    };    
    mockingoose(CelebrationModel).toReturn(mockedCelebration, "create");  
    // Test invalid inputs using test.each for better reusability
    const invalidInputs = [
      { testNameEnding: 'an empty person', field: 'person', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an empty occasion',field: 'occasion', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an empty plan',field: 'plan', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an invalid user mongo _Id',field: 'user', value: '190-no-dashes-allowed', expectedStatus: 412 },
      { testNameEnding: 'an invalid date format',field: 'date', value: 'Not/Valid/Date', expectedStatus: 412 },
      { testNameEnding: 'anything but a list array',field: 'othersInvolved', value: 'string', expectedStatus: 412 },
      { testNameEnding: 'anything but Public or Private',field: 'visibility', value: 'Wrong', expectedStatus: 412 },
  
    ];  
    test.each(invalidInputs)(
      "Shouldn't allow $testNameEnding",
      async ({ field, value, expectedStatus }) => {
        const res = await request(app).post("/celebrations").send({ ...mockedCelebration, [field]: value });
        // Assert
        expect(res.statusCode).toBe(expectedStatus);
      }
    );  
    // Test success case for posting a celebration to the database
    test("Should post a celebration to the database", async () => {
      const res = await request(app).post("/celebrations").send(mockedCelebration);  
      // Assert
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body._id).toMatch(/^[a-zA-Z0-9]{24}$/);
    });
  });

// #4 Put/alter a celebration tests ******************************************************************
  describe("PUT /celebrations/:celebrationId", () => {
    // Setup mocked response.    
    const mockedCelebration = {
      person: "Mocked Altered Person", 
      occasion: "Mocked Altered Celebration", 
      plan: "Mocked Altered Plan", 
      user: "FabFaceDa7aba5eD1fD00b1e",
      date: "Dec 28, 2024", 
      location: "Mocked Altered Location",
      othersInvolved: ["Mocked Other3", "Mocked Other4"],
      visibility: "Private"
    }; 
    mockingoose(CelebrationModel).toReturn({ _id: "mockedCelebMongoDBObjtId", ...mockedCelebration }, "findOneAndUpdate"); // Mock update method;
    // Test invalid mongoDB Object Ids (_id)
    test("Shouldn't allow invalid celebrationId in params", async () => {     
      const res = await request(app).put("/celebrations/incorrectChars -$ForObId").send({}); 
      // Assert    
      expect(res.statusCode).toBe(412);
    });
    // Test invalid inputs using test.each for better reusability
    const invalidInputs = [
      { testNameEnding: 'an empty person', field: 'person', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an empty occasion',field: 'occasion', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an empty plan',field: 'plan', value: ' ', expectedStatus: 412 },
      { testNameEnding: 'an invalid user mongo _Id',field: 'user', value: '190-no-dashes-allowed', expectedStatus: 412 },
      { testNameEnding: 'an invalid date format',field: 'date', value: 'Not/Valid/Date', expectedStatus: 412 },
      { testNameEnding: 'anything but a list array',field: 'othersInvolved', value: 'string', expectedStatus: 412 },
      { testNameEnding: 'anything but Public or Private',field: 'visibility', value: 'Wrong', expectedStatus: 412 },
    ];  
    test.each(invalidInputs)(
      "Shouldn't allow $testNameEnding",
      async ({ field, value, expectedStatus }) => {
        const res = await request(app).put("/celebrations/mockedCelebMongoDBObjtId").send({ ...mockedCelebration, [field]: value });
        // Assert
        expect(res.statusCode).toBe(expectedStatus);
      }
    );  
    // Test success case for updating a celebration in the database
    test("Should update a celebration in the database", async () => {
      const res = await request(app).put("/celebrations/mockedCelebMongoDBObjtId").send(mockedCelebration);
      // Assert  
      expect(res.statusCode).toBe(204);    
    });
  });

// #5 Delete a celebration tests *********************************************************************
  describe("DELETE /celebrations/:celebrationId", () => {
     // Test invalid mongoDB Object Ids (_id)
     test("Shouldn't allow invalid Id Param", async () => {    
      const res = await request(app).delete("/celebrations/incorrectChars_.!ForObId");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    // Test success case for deleting a celebration
    test("Should delete celebration from database", async () => {
    // Setup mocked response of findById to return a valid celebration
    mockingoose(CelebrationModel).toReturn(
      {
        _id: "Ce1FaceDa7aBa5e1dD00b1ed",
        user: { _id: "mockedUserMongoDBObjctId" },
      },
      "findById"
    );
    // Setup mocked response of deleteOne to return a successful result
    mockingoose(CelebrationModel).toReturn({ deletedCount: 1 }, "deleteOne");
    const res = await request(app).delete("/celebrations/Ce1FaceDa7aBa5e1dD00b1ed");
    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Celebration was deleted successfully!");
  });
    // Test case for not finding the celebration in the database
    test("Should inform if there already was no celebration by that Id in the database", async () => {
      // Setup mocked response.
      mockingoose(CelebrationModel).toReturn(null, "findOne"); // use findOne because findById is shorthand for findOne({ _id: id }) & overwrites null
      const res = await request(app).delete("/celebrations/missingCeleMongoDBObjtId");
      // Assert
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe(
        "Cannot delete celebration with celebrationId=missingCeleMongoDBObjtId. This celebrationId was not found!"
      );
    });
  });


});