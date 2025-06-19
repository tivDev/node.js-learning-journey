const Item = require('../models/itemModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    successResponse(res, 200, items);
  } catch (error) {
    errorResponse(res, 500, 'Error fetching items', error);
  }
};

// Get item by id
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return errorResponse(res, 404, `Item id ${req.params.id} not found`);
    }
    successResponse(res, 200, item);
  } catch (error) {
    errorResponse(res, 500, 'Error fetching item', error);
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newItem = await Item.create({ title, description });
    successResponse(res, 201, newItem, 'Item created successfully');
    
    // Emit real-time event
    req.app.get('io').emit('item_created', newItem);
  } catch (error) {
    errorResponse(res, 400, 'Error creating item', error);
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return errorResponse(res, 404, 'Item not found');
    }
    
    item.title = title || item.title;
    item.description = description || item.description;
    await item.save();
    
    successResponse(res, 200, item, 'Item updated successfully');
    
    // Emit real-time event
    req.app.get('io').emit('item_updated', item);
  } catch (error) {
    errorResponse(res, 400, 'Error updating item', error);
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) {
      return errorResponse(res, 404, 'Item not found');
    }
    
    await item.destroy();
    successResponse(res, 200, null, 'Item deleted successfully');
    
    // Emit real-time event
    req.app.get('io').emit('item_deleted', { id: req.params.id });
  } catch (error) {
    errorResponse(res, 500, 'Error deleting item', error);
  }
};

