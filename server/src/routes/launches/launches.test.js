const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe("Test GET /launches", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200);
        });
    });

    describe("Test POST /launches", () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            launchDate: "January 4, 2029",
            target: "Kepler-62 f",
        };
        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
        };
        const launchDataWithInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            launchDate: "zoot",
            target: "Kepler-62 f",
        };

        // Success cases
        test("It should respond with 201 created", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(completeLaunchData)
                .expect("Content-Type", /json/)
                .expect(201);

            // Expect that request and response dates are the same
            const requestDate = new Date(
                completeLaunchData.launchDate
            ).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            // Expect that request and response object property values are the same
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        // Failed cases
        test("It should catch missing required properties", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithoutDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Missing required launch property",
            });
        });
        test("It should catch invalid date", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithInvalidDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Invalid launch date",
            });
        });
    });
});
