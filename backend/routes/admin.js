const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.use(auth);

router.get('/dashboard-data', adminController.dashboardData); 
// router.get('/dashboard', adminController.dashboard);
router.get('/analytics', adminController.analytics);
router.post('/products/:sku/feedback/:idx/reply', adminController.replyFeedback);

router.post('/logout', (req, res) => res.json({ message: 'OK' }));

// Add export routes
router.get('/export/users.xml', adminController.exportUsersXML);
router.get('/export/products.xml', adminController.exportProductsXML);
router.get('/export/purchases.xml', adminController.exportPurchasesXML);

module.exports = router;