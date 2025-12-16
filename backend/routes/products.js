const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.list);

router.post('/', productController.create);

router.put('/:sku', productController.update);

// add stock
router.post('/:sku/add-stock', productController.addStock);

router.post('/:sku/disable', productController.setDisabled);
router.post('/:sku/feedback', productController.addFeedback);
router.delete('/:sku', productController.remove);

module.exports = router;