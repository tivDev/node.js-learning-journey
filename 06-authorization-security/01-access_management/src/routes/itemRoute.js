// src/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', verifyToken, authorize('read', 'items'), itemController.getAllItems);
router.get('/my-items', verifyToken, authorize('read', 'items'), itemController.getByCreatedBy);
router.get('/:id', verifyToken, authorize('read', 'items'), itemController.getById);
router.post('/create/', verifyToken, authorize('create', 'items'), itemController.createItem);
router.put('/update/:id', verifyToken, authorize('update', 'items'), itemController.updateItem);
router.delete('/delete/:id', verifyToken, authorize('delete', 'items'), itemController.deleteItem);

module.exports = router;

