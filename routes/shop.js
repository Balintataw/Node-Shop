const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndexPage);

router.get('/products', shopController.getProductsListPage);
router.get('/products/:uid', shopController.getProductDetailPage);

router.get('/cart', shopController.getCartPage);
router.post('/cart', shopController.postToCart);

router.get('/orders', shopController.getOrdersPage);

router.get('/checkout', shopController.getCheckoutPage);

module.exports = router;