const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', {title: 'Add Product', path: '/admin/add-product'});
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const image = req.body.image;
  const desc = req.body.description;
  const newProduct = new Product({title, price, image, desc});
  newProduct.save();
  res.redirect('/');
};

exports.getShopPage = async (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  // const products = [
  //   { title: 'Gardens of the Moon', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/514xh1DzfpL._SX293_BO1,204,203,200_.jpg' },
  //   { title: 'Deadhouse Gates', price: 17.99, image: 'https://images-na.ssl-images-amazon.com/images/I/51WXykWNzLL._SX295_BO1,204,203,200_.jpg' }]
  try {
    const products = await Product.getProducts();
    res.render('shop/product-list', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.log("Error fetching products", error);
  }
};

exports.getProductsPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    res.render('admin/products', { products, path: '/admin/products', title: 'ADmin Products' });
  } catch (error) {
    console.log("Error fetching products", error);
  }
}