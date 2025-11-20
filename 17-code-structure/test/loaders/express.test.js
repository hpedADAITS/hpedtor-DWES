const request = require("supertest");
const app = require("../../src/app");

describe("Express Loader", () => {
  it("should parse JSON bodies", async () => {
    app.post("/test-json", (req, res) => {
      res.json(req.body);
    });

    const response = await request(app)
      .post("/test-json")
      .send({ key: "value" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: "value" });
  });

  it("should parse URL-encoded bodies", async () => {
    app.post("/test-urlencoded", (req, res) => {
      res.json(req.body);
    });

    const response = await request(app)
      .post("/test-urlencoded")
      .send("name=test&age=30")
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "test", age: "30" });
  });
});
