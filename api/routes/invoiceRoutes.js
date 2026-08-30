const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/invoices/generate', invoiceController.generateInvoicePdf);
router.post('/invoices/generate', invoiceController.generateInvoicePdf);

module.exports = router;
