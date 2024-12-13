import request from "supertest";
const mockingoose = require("mockingoose");
import express, { Request, Response, NextFunction } from "express";
import GoalModel from "../../src/models/goalsModel";
import routes from "../../src/routes";

const app = express();
app.use(express.json());
app.use("/", routes);

// Function to format date string into ISO format
function convertToISOString(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

describe("Goal Routes", () => {
  // #1 Get all of a user's goals tests ********************************************************************
  describe("GET /goals/user/:userId", () => {
    // Mocking the database response for the "find" call
    mockingoose(GoalModel).toReturn(
      [
        {
          _id: "608b2f77e6034e31d8239123",
          name: "Mocked Goal 1",
          description: "Mocked description 1",
          dueDate: "2024-12-31",
          userId: "608b2f77e6034e31d8239123",  // Make sure userId is correct here
        },
        {
          _id: "608b2f77e6034e31d8239124",
          name: "Mocked Goal 2",
          description: "Mocked description 2",
          dueDate: "2024-12-31",
          userId: "608b2f77e6034e31d8239123",  // Make sure userId is correct here
        },
      ],
      "find"
    );
  
    test("Shouldn't allow invalid Id Param", async () => {
      // Invalid userId in the request
      const res = await request(app).get("/goals/user/invalidObjectId");
      expect(res.statusCode).toBe(412);
      expect(res.body.message).toBe('Invalid user ID format');  // You expect a specific error message
    });
  
    test("Should return all goals for the user from the database", async () => {
      // Valid userId in the request
      const res = await request(app).get("/goals/user/mockUserId");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject([
        {
          _id: expect.any(String),  // Check for string type ID
          name: "Mocked Goal 1",
          description: "Mocked description 1",
          dueDate: "2024-12-31",  // Directly match the string, as it's mock data
          userId: "55532c284e8d64fbf0ea178f",   // Consistent with the mock data
        },
        {
          _id: expect.any(String),  // Check for string type ID
          name: "Mocked Goal 2",
          description: "Mocked description 2",
          dueDate: "2024-12-31",  // Directly match the string, as it's mock data
          userId: "55532c284e8d64fbf0ea178f",   // Consistent with the mock data
        },
      ]);
    });
  });
  

  // #2 Get a specific goal tests ********************************************************************
  describe("GET /goals/:goalId", () => {
    mockingoose(GoalModel).toReturn(
      {
        _id: "608b2f77e6034e31d8239123",
        name: "Mocked Goal",
        description: "Mocked description",
        dueDate: "2024-12-31",
        userId: "mockUserId",
      },
      "findOne"
    );

    test("Shouldn't allow invalid Id Param", async () => {
      const res = await request(app).get("/goals/invalidObjectId");
      expect(res.statusCode).toBe(412);
    });

    test("Should return the specific goal from the database", async () => {
      const res = await request(app).get("/goals/608b2f77e6034e31d8239123");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        _id: "608b2f77e6034e31d8239123",
        name: "Mocked Goal",
        description: "Mocked description",
        dueDate: convertToISOString("2024-12-31"),
        userId: "mockuserid",
      });
    });
  });

  // #3 Create a new goal tests ********************************************************************
  describe("POST /goals", () => {
    const mockedGoal = {
      name: "Mocked Goal",
      description: "Mocked description",
      dueDate: "2024-12-31",
      userId: "608b2f77e6034e31d8239123",
    };

    mockingoose(GoalModel).toReturn(mockedGoal, "create");

    const invalidInputs = [
      { testNameEnding: "empty name", field: "name", value: " ", expectedStatus: 412 },
      { testNameEnding: "empty description", field: "description", value: " ", expectedStatus: 412 },
      { testNameEnding: "invalid userId format", field: "userId", value: "invalidId", expectedStatus: 412 },
      { testNameEnding: "invalid date format", field: "dueDate", value: "not/a/date", expectedStatus: 412 },
    ];

    test.each(invalidInputs)(
      "Shouldn't allow $testNameEnding",
      async ({ field, value, expectedStatus }) => {
        const res = await request(app).post("/goals").send({ ...mockedGoal, [field]: value });
        expect(res.statusCode).toBe(expectedStatus);
      }
    );

    test("Should create a new goal in the database", async () => {
      const res = await request(app).post("/goals").send(mockedGoal);
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        message: "Goal created successfully",
        goal: mockedGoal,
      });
    });
  });

  // #4 Update a specific goal tests ********************************************************************
  describe("PUT /goals/:goalId", () => {
    mockingoose(GoalModel).toReturn(
      {
        _id: "608b2f77e6034e31d8239123",
        name: "Updated Goal",
        description: "Updated description",
        dueDate: "2025-01-01",
        userId: "mockUserId",
      },
      "findOneAndUpdate"
    );

    test("Should update a goal in the database", async () => {
      const updatedData = {
        name: "Updated Goal",
        description: "Updated description",
        dueDate: "2025-01-01",
      };

      const res = await request(app).put("/goals/608b2f77e6034e31d8239123").send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        name: "Updated Goal",
        description: "Updated description",
        dueDate: convertToISOString("2025-01-01"),
      });
    });
  });

  // #5 Delete a specific goal tests ********************************************************************
  describe("DELETE /goals/:goalId", () => {
    mockingoose(GoalModel).toReturn(
      {
        _id: "608b2f77e6034e31d8239123",
        name: "Deleted Goal",
        description: "Deleted description",
        dueDate: "2024-12-31",
        userId: "mockUserId",
      },
      "findOneAndDelete"
    );

    test("Should delete a goal from the database", async () => {
      const res = await request(app).delete("/goals/608b2f77e6034e31d8239123");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        _id: "608b2f77e6034e31d8239123",
        name: "Deleted Goal",
      });
    });
  });
});
