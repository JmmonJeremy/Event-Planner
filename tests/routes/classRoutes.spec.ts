import request from "supertest";
const mockingoose = require("mockingoose");
import express, { Request, Response } from "express";
import ClassModel from "../../src/models/classModel";
import routes from "../../src/routes";

const app = express();
app.use(express.json());
app.use("/", routes);


describe("Class Routes", () => {

  describe("GET /classes/:classId", () => {
    // Setup mocked response.
    mockingoose(ClassModel).toReturn({ name: "Data Structures" }, "findOne");

    it("Shouldn't allow invalid Id Param", async () => {
      // Act
      const res = await request(app).get("/classes/00000000");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Should return class from database", async () => {
      // Act
      const res = await request(app).get("/classes/jjjjjjjjjjjjjjjjjjjjjjjj");

      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name");
      expect(res.body?.name).toEqual("Data Structures");
    });
  });

  describe("GET /classes/user/:userId", () => {
    // Setup mocked response.
    mockingoose(ClassModel).toReturn([{ name: "Data Structures" }, {name: "Web Services"}], "find");

    it("Shouldn't allow invalid Id Param", async () => {
      // Act
      const res = await request(app).get("/classes/user/00000000");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Should return class from database", async () => {
      // Act
      const res = await request(app).get("/classes/user/jjjjjjjjjjjjjjjjjjjjjjjj");

      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toEqual("Data Structures");
      expect(res.body[1].name).toEqual("Web Services");
    });
  });

  describe("POST /classes", () => {
    // Setup mocked response.
    const fakeClass = {
          "name": "Having Fun",
          "teacher": "Fake Name",
          "userId": "jjjjjjjjjjjjjjjjjjjjjjjj",
          "startTime": "1970-01-01T09:00",
          "length": 90,
          "days":[1,3,5]
      }
    mockingoose(ClassModel).toReturn(fakeClass, "save");

    it("Shouldn't allow invalid time", async () => {
      // Act
      const res = await request(app).post("/classes").send({ ...fakeClass, startTime: "190-01-01T09:00" });
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Shouldn't allow invalid userId", async () => {
      // Act
      const res = await request(app).post("/classes").send({ ...fakeClass, userId: "jjjj,jjj" });
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Should post class to the database", async () => {
      // Act
      const res = await request(app).post("/classes").send(fakeClass);

      // Assert
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body?._id).toMatch(/^[a-zA-Z0-9]{24}$/);
    });
  });

  describe("POST /classes/createWithArray", () => {
    // Setup mocked response.
    const fakeClasses = [
        {
          "name": "Having Fun",
          "teacher": "Fake Name",
          "userId": "jjjjjjjjjjjjjjjjjjjjjjjj",
          "startTime": "1970-01-01T09:00",
          "length": 90,
          "days":[1,3,5]
      },
      {
        "name": "Having Fun",
        "teacher": "Fake Name",
        "userId": "jjjjjjjjjjjjjjjjjjjjjjjj",
        "startTime": "1970-01-01T09:00",
        "length": 90,
        "days":[1,3,5]
      }

    ]
    mockingoose(ClassModel).toReturn(fakeClasses, "insertMany");

    it("Should post classes to the database", async () => {
      // Act
      const res = await request(app).post("/classes/createWithArray").send(fakeClasses);

      // Assert
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]._id).toMatch(/^[a-zA-Z0-9]{24}$/);
      expect(res.body[1]._id).toMatch(/^[a-zA-Z0-9]{24}$/);
    });
  });

  describe("PUT /classes/:classId", () => {
    // Setup mocked response.
    mockingoose(ClassModel).toReturn({}, "save");

    const fakeClass = {
          "name": "Having Fun",
          "teacher": "Fake Name",
          "userId": "jjjjjjjjjjjjjjjjjjjjjjjj",
          "startTime": "1970-01-01T09:00",
          "length": 90,
          "days":[1,3,5]
      }
    it("Shouldn't allow invalid userId in params", async () => {
      // Act
      const res = await request(app).put("/classes/jjjjjjjjjjjjjj,jjjjjjjjj").send({});
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Shouldn't allow invalid time", async () => {
      // Act
      const res = await request(app).put("/classes/jjjjjjjjjjjjjjjjjjjjjjjj").send({ ...fakeClass, startTime: "190-01-01T09:00" });
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Shouldn't allow invalid userId in body", async () => {
      // Act
      const res = await request(app).put("/classes/jjjjjjjjjjjjjjjjjjjjjjjj").send({ ...fakeClass, userId: "jjjj,jjj" });
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Should update class in the database", async () => {
      // Act
      const res = await request(app).put("/classes/jjjjjjjjjjjjjjjjjjjjjjjj").send(fakeClass);

      // Assert
      expect(res.statusCode).toBe(204);
    });
  });

  describe("DELETE /classes/:classId", () => {
    // Setup mocked response.
    mockingoose(ClassModel).toReturn({}, "deleteOne");

    it("Shouldn't allow invalid Id Param", async () => {
      // Act
      const res = await request(app).delete("/classes/00000000");
      // Assert
      expect(res.statusCode).toBe(412);
    });
    it("Should delete class from database", async () => {
      // Act
      const res = await request(app).delete("/classes/jjjjjjjjjjjjjjjjjjjjjjjj");

      // Assert
      expect(res.statusCode).toBe(200);
    });
    it("Should inform if there already was no class by that Id in the database", async () => {
      //Setup
      mockingoose(ClassModel).toReturn(null, "deleteOne");
      // Act
      const res = await request(app).delete("/classes/jjjjjjjjjjjjjjjjjjjjjjjj");

      // Assert
      expect(res.statusCode).toBe(404);
    });
  });

});
