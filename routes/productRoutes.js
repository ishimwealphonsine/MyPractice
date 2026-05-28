const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// SHOW DASHBOARD
router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const inStockProducts = products.filter((product) => Number(product.quantity) > 0);
    const outOfStockProducts = products.filter((product) => Number(product.quantity) <= 0);

    const totalStockValue = inStockProducts.reduce((sum, product) => {
      return sum + Number(product.price) * Number(product.quantity);
    }, 0);

    res.render('dashboard', {
      products,
      inStockValue: totalStockValue,
      outOfStockCount: outOfStockProducts.length,
      success: req.query.success === 'true',
      errors: {},
      formData: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ADD PRODUCT
router.post('/dashboard', async (req, res) => {
  try {
    const { name, category, price, quantity, color } = req.body;

    const errors = {};

    if (!name || name.trim() === '') {
      errors.name = 'Invalid field';
    }

    if (!category || category.trim() === '') {
      errors.category = 'Invalid field';
    }

    if (!price || Number(price) <= 0) {
      errors.price = 'Invalid field';
    }

    if (quantity === '' || quantity === undefined || Number(quantity) < 0) {
      errors.quantity = 'Invalid field';
    }

    if (!color || color.trim() === '') {
      errors.color = 'Invalid field';
    }

    if (Object.keys(errors).length > 0) {
      const products = await Product.find().sort({ createdAt: -1 });

      const inStockProducts = products.filter((product) => Number(product.quantity) > 0);
      const outOfStockProducts = products.filter((product) => Number(product.quantity) <= 0);

      const totalStockValue = inStockProducts.reduce((sum, product) => {
        return sum + Number(product.price) * Number(product.quantity);
      }, 0);

      return res.render('dashboard', {
        products,
        inStockValue: totalStockValue,
        outOfStockCount: outOfStockProducts.length,
        success: false,
        errors,
        formData: req.body
      });
    }

    await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      color: color.trim()
    });

    res.redirect('/dashboard?success=true');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;