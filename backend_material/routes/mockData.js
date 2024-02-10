const express = require ("express");
const router = express.Router();
const { createItem, viewItem, updateItem, deleteItem, viewAllItems, deleteMultipleItems, selctedrecords } = require("../controllers/mockData.controller");

router.get('/viewAll', viewAllItems);
router.get('/view', viewItem);
router.post('/create', createItem);
router.put('/update', updateItem);
router.delete('/delete', deleteItem);
router.delete('/deleteMultiple', deleteMultipleItems);
router.get('/selctedrecords', selctedrecords);

module.exports = router;