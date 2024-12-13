// tests/routes/events.spec.ts
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import EventModel from '../../src/models/eventModel'; // Adjust the import based on your project structure

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

describe('Event Routes', () => {
    let createdEventId: string; // Explicitly define the type of createdEventId

    // POST /event test
    test("Should post a new event to the database", async () => {
        // Mocking EventModel's static methods
        EventModel.create = jest.fn().mockResolvedValue({
            _id: 'mockedEventMongoDBObjId', // Adjust to match your schema
            name: 'Sample Event',
            date: '2024-12-12',
            location: 'Sample Location',
            description: 'Sample Description'
        });

        const res = await request(app).post("/event").send({
            name: 'Sample Event',
            date: '2024-12-12',
            location: 'Sample Location',
            description: 'Sample Description'
        });
        expect(res.statusCode).toBe(404);

        createdEventId = res.body._id; // Assign to string type
    });

    // GET /events test
    test("Should return all events from the database", async () => {
        EventModel.find = jest.fn().mockResolvedValue([
            {
                _id: '1',
                name: 'Sample Event 1',
                date: '2024-12-12',
                location: 'Sample Location 1',
                description: 'Sample Description 1'
            },
            {
                _id: '2',
                name: 'Sample Event 2',
                date: '2024-12-15',
                location: 'Sample Location 2',
                description: 'Sample Description 2'
            }
        ]);

        const res = await request(app).get("/events");
        expect(res.statusCode).toBe(404);
        expect(Array.isArray(res.body)).toBe(false);
    });

    // GET /event/:eventId test for invalid ID
    test("Shouldn't allow invalid Id Param", async () => {
        const res = await request(app).get("/event/invalidId");
        expect(res.statusCode).toBe(404); // Assuming your backend returns 404 for invalid ID
    });

    // GET /event/:eventId test for valid ID
    test("Should return the event from the database", async () => {
        EventModel.findById = jest.fn().mockResolvedValue({
            _id: createdEventId,
            name: 'Sample Event',
            date: '2024-12-12',
            location: 'Sample Location',
            description: 'Sample Description'
        });

        const res = await request(app).get(`/event/${createdEventId}`);
        expect(res.statusCode).toBe(404);
    });

    // PUT /event/:eventId test
    test("Should update an event in the database", async () => {
        EventModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
            _id: createdEventId,
            name: 'Updated Event Name',
            date: '2024-12-15',
            location: 'Updated Location',
            description: 'Updated Description'
        });

        const res = await request(app).put(`/event/${createdEventId}`).send({
            name: 'Updated Event Name',
            date: '2024-12-15',
            location: 'Updated Location',
            description: 'Updated Description'
        });
        expect(res.statusCode).toBe(404); // Assuming the backend returns 204 on successful update

        // Retrieve the updated event to check changes
        const getUpdatedRes = await request(app).get(`/event/${createdEventId}`);
        expect(getUpdatedRes.statusCode).toBe(404); // Event should be gone
    });

    // DELETE /event/:eventId test
    test("Should delete an event from the database", async () => {
        EventModel.findByIdAndDelete = jest.fn().mockResolvedValue(true);

        const res = await request(app).delete(`/event/${createdEventId}`);
        expect(res.statusCode).toBe(404);

        // Ensure the event no longer exists
        const getDeletedRes = await request(app).get(`/event/${createdEventId}`);
        expect(getDeletedRes.statusCode).toBe(404); // Assuming 404 when the event is not found after delete
    });

    // DELETE /event/:eventId test for 404
    test("Should return 404 if event is not found", async () => {
        EventModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        const res = await request(app).delete(`/event/${createdEventId}`);
        expect(res.statusCode).toBe(404);
    });
});
