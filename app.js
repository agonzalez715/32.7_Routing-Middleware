const express = require('express');
const { getAllItems, addItem, findItem, updateItem, deleteItem } = require("./fakeDb");

const app = express(); // Create the main Express application
app.use(express.json()); // Middleware to parse JSON bodies

const router = express.Router(); // Create a new router

// Define routes using the router
router.get("/", (req, res) => {
    return res.json(getAllItems());
});

router.post("/", (req, res) => {
    const newItem = req.body;
    if (!newItem.name || newItem.price == null) {
        return res.status(400).json({ error: "Missing name or price" });
    }
    addItem(newItem);
    return res.status(201).json({ added: newItem });
});

router.get("/:name", (req, res) => {
    const item = findItem(req.params.name);
    if (item) {
        return res.json(item);
    } else {
        return res.status(404).json({ error: "Item not found" });
    }
});

router.patch("/:name", (req, res) => {
    const updatedItem = updateItem(req.params.name, req.body);
    if (updatedItem) {
        return res.json({ updated: updatedItem });
    } else {
        return res.status(404).json({ error: "Item not found" });
    }
});

router.delete("/:name", (req, res) => {
    const deleted = deleteItem(req.params.name);
    if (deleted) {
        return res.json({ message: "Deleted" });
    } else {
        return res.status(404).json({ error: "Item not found" });
    }
});

app.use("/items", router); // Mount the router at the '/items' path

// Optional: Define a listener within the file only if this is your main entry point
if (require.main === module) {
    app.listen(3000, () => console.log("Server is listening on port 3000"));
}

module.exports = app; // Correct placement: Export the app for testing and potential other uses