const express = require('express');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndexPage);

router.get('/products', shopController.getProductsListPage);
router.get('/products/:id', shopController.getProductDetailPage);

router.get('/cart', shopController.getCartPage);
router.post('/cart', shopController.postToCart);
router.post('/cart_delete_item', shopController.postToCartRemoveItem);

router.get('/orders', shopController.getOrdersPage);
router.post('/create_order', shopController.postOrder);

router.get('/checkout', shopController.getCheckoutPage);

module.exports = router;
