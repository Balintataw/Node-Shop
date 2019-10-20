const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add_product', adminController.getAddProductPage);

router.get('/products', adminController.getProductsPage);

router.post('/product', adminController.postAddProduct);

module.exports = router;