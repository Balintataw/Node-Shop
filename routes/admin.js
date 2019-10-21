const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add_product', adminController.getAddProductPage);

router.get('/edit_product/:id', adminController.getEditProductPage);

router.post('/edit_product', adminController.postEditProduct);

router.get('/products', adminController.getProductsPage);

router.post('/product', adminController.postAddProduct);

router.post('/delete_product', adminController.postDeleteProduct);

module.exports = router;