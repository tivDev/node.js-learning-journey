const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Item routes
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.createItem);
router.put('/', itemController.updateItem);
router.delete('/', itemController.deleteItem);


module.exports = router;