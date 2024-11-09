const request = require("supertest");
const app = require('./app');  // Adjust the path as necessary // Import your express app
const { resetItems, addItem, getAllItems } = require("./fakeDb");

beforeEach(() => {
  resetItems(); // Clears the items array before each test
});

describe("Shopping List API", () => {
  test("GET /items - should return an empty array when no items", async () => {
    const response = await request(app).get("/items");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]); // Expect an empty array when no items have been added
  });

  test("GET /items - should get all items", async () => {
    // Seed the items
    addItem({ name: "popsicle", price: 1.45 });
    addItem({ name: "cheerios", price: 3.40 });

    const response = await request(app).get("/items");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(getAllItems()); // Use the actual function to retrieve items for comparison
  });

  test("POST /items - should add a new item", async () => {
    const newItem = { name: "banana", price: 0.79 };
    const response = await request(app).post("/items").send(newItem);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ added: newItem });
    expect(getAllItems()).toContainEqual(newItem); // Check if the new item is actually added to the database
  });

  test("POST /items - should return 400 if missing name or price", async () => {
    const response1 = await request(app).post("/items").send({ price: 1.0 });
    const response2 = await request(app).post("/items").send({ name: "apple" });
    expect(response1.statusCode).toBe(400);
    expect(response2.statusCode).toBe(400);
  });

  test("GET /items/:name - should get an item by name", async () => {
    addItem({ name: "cookies", price: 2.99 });
    const response = await request(app).get("/items/cookies");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ name: "cookies", price: 2.99 });
  });

  test("GET /items/:name - should return 404 if item not found", async () => {
    const response = await request(app).get("/items/nonexistent");
    expect(response.statusCode).toBe(404);
  });

  test("PATCH /items/:name - should update an item", async () => {
    addItem({ name: "milk", price: 3.0 });
    const response = await request(app).patch("/items/milk").send({ price: 3.5 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ updated: { name: "milk", price: 3.5 } });
    expect(getAllItems()).toContainEqual({ name: "milk", price: 3.5 });
  });

  test("PATCH /items/:name - should return 404 if item not found", async () => {
    const response = await request(app).patch("/items/nonexistent").send({ price: 5.0 });
    expect(response.statusCode).toBe(404);
  });

  test("DELETE /items/:name - should delete an item", async () => {
    addItem({ name: "bread", price: 2.5 });
    const response = await request(app).delete("/items/bread");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
    expect(getAllItems()).not.toContainEqual({ name: "bread", price: 2.5 });
  });

  test("DELETE /items/:name - should return 404 if item not found", async () => {
    const response = await request(app).delete("/items/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});