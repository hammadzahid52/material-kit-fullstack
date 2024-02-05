const express = require ("express");
const router = express.Router();
const { createItem, viewItem, updateItem, deleteItem, viewAllItems } = require("../controllers/mockData.controller");

router.get('/viewAll', viewAllItems);
router.get('/view', viewItem);
router.post('/create', createItem);
router.put('/update', updateItem);
router.delete('/delete', deleteItem);

module.exports = router;