const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('admin/add-product', { title: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUri = req.body.imageUri;
  const description = req.body.description;
  try {
    await req.user.createProduct({
      title,
      price,
      imageUri,
      description,
    })
    // await Product.create({
    //   title,
    //   price,
    //   imageUri,
    //   description,
    //   userId: req.user.id,
    // });
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/');
    console.error("Error adding product", error);
  }
};

exports.getShopPage = async (req, res, next) => {
  try {
    const products = await Product.getProducts();
    res.render('shop/product-list', { products, path: '/shop', title: 'Shop' });
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getProductsPage = async (req, res, next) => {
  try {
    // const products = await Product.findAll();
    const products = await req.user.getProducts();
    res.render('admin/products', {
      products,
      path: '/admin/products',
      title: 'Admin Products'
    });
  } catch (error) {
    console.error("Error getting products", error);
  }
};

exports.getEditProductPage = async (req, res, next) => {
  const id = req.params.id;
  try {
    // const product = await Product.findByPk(id);
    const products = await req.user.getProducts({ where: { id: id } });
    const product = products[0];
    res.render('admin/edit-product', { product, path: '/admin/edit_product', title: `Edit ${product.title}` });
  } catch (error) {
    res.redirect('/');
    console.error("Error fetching product for editing", error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const imageUri = req.body.imageUri;
  const description = req.body.description;
  try {
    const newProduct = { title, price, imageUri, description };
    await Product.update(newProduct, {
      where: {
        id: id
      }
    });
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/');
    console.error("Error updating product", error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.id;
  try {
    const product = await Product.findByPk(id);
    await product.destroy();
    res.redirect("/admin/products");
  } catch (error) {
    res.redirect('/');
    console.error("Error deleting product", error);
  }
};