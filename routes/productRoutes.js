const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/dashboard', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const inStock = products.filter(p => p.quantity > 0);
    const outOfStock = products.filter(p => p.quantity === 0);
    const totalStockValue = inStock.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    res.render('dashboard', {
      products,
      inStockValue: totalStockValue,
      outOfStockCount: outOfStock.length,
      success: req.query.success,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/add-product', async (req, res) => {
  try {
    const { name, category, price, quantity, color } = req.body;
    await Product.create({ name, category, price, quantity, color });
    res.redirect('/?success=true');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;