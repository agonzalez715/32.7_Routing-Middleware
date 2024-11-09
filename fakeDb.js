let items = []; // Use let for reassignment in tests

function resetItems() {
    items = []; // Function to reset items array
}

function getAllItems() {
    return items; // Function to get all items
}

function addItem(item) {
    items.push(item); // Function to add item
}

function findItem(name) {
    return items.find(item => item.name === name); // Function to find an item by name
}

function updateItem(name, newItem) {
    const index = items.findIndex(item => item.name === name);
    if (index !== -1) {
        items[index] = { ...items[index], ...newItem };
        return items[index];
    }
    return null; // Return null if item not found
}

function deleteItem(name) {
    const index = items.findIndex(item => item.name === name);
    if (index !== -1) {
        items.splice(index, 1);
        return true; // Return true if item deleted
    }
    return false; // Return false if item not found
}

module.exports = { resetItems, getAllItems, addItem, findItem, updateItem, deleteItem };