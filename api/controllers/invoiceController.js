const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const drawText = ({ page, text, x, y, size = 12, font, color = rgb(0, 0, 0) }) => {
  page.drawText(String(text), {
    x,
    y,
    size,
    font,
    color,
  });
};

const generateInvoicePdf = async (invoiceData) => {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();

  let y = height - 40;
  drawText({ page, text: 'Factura', x: width / 2 - 30, y, size: 24, font: boldFont });
  y -= 30;
  drawText({ page, text: 'pinpao', x: width / 2 - 25, y, size: 12, font });
  y -= 16;
  drawText({ page, text: 'Calle 6 2-40', x: width / 2 - 35, y, size: 12, font });
  y -= 16;
  drawText({ page, text: 'Teléfono: 3012802459', x: width / 2 - 45, y, size: 12, font });
  y -= 16;
  drawText({ page, text: 'Correo: info@pinpao', x: width / 2 - 35, y, size: 12, font });

  y -= 35;
  drawText({ page, text: 'Factura para:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.name || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Correo:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.email || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Dirección:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.address || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Barrio:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.barrio || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Municipio:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.municipio || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Departamento:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: invoiceData.departamento || '', x: 170, y, size: 12, font });
  y -= 18;
  drawText({ page, text: 'Código de Pago:', x: 50, y, size: 12, font: boldFont });
  drawText({ page, text: String(invoiceData.paymentCode || 'N/A'), x: 170, y, size: 12, font });

  y -= 35;
  const columns = [
    { label: 'Producto', x: 50, width: 220 },
    { label: 'Cantidad', x: 280, width: 70 },
    { label: 'Precio Unitario', x: 360, width: 90 },
    { label: 'Total', x: 470, width: 90 },
  ];

  columns.forEach((column) => {
    drawText({ page, text: column.label, x: column.x, y, size: 12, font: boldFont, color: rgb(1, 1, 1) });
  });

  y -= 20;
  const tableRows = (invoiceData.cartItems || []).map((item) => ({
    product: item.product?.name || 'Producto sin nombre',
    quantity: item.quantity || 0,
    unitPrice: formatCurrency(item.product?.price || 0),
    subtotal: formatCurrency(Number(item.product?.price || 0) * Number(item.quantity || 0)),
  }));

  tableRows.forEach((row) => {
    drawText({ page, text: row.product, x: 50, y, size: 11, font });
    drawText({ page, text: String(row.quantity), x: 280, y, size: 11, font });
    drawText({ page, text: row.unitPrice, x: 360, y, size: 11, font });
    drawText({ page, text: row.subtotal, x: 470, y, size: 11, font });
    y -= 18;
  });

  y -= 25;
  const total = (invoiceData.cartItems || []).reduce((sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0), 0);
  drawText({ page, text: `Total: ${formatCurrency(total)} USD`, x: 50, y, size: 14, font: boldFont });
  y -= 25;
  drawText({ page, text: 'Gracias por su compra', x: width / 2 - 55, y, size: 12, font, color: rgb(0, 0.5, 0) });
  y -= 18;
  drawText({ page, text: 'Por favor, conserve esta factura para sus registros', x: width / 2 - 115, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });

  return doc.save();
};

exports.generateInvoicePdf = async (req, res) => {
  try {
    const rawInvoiceData = req.body?.invoiceData || req.query?.invoiceData;
    const invoiceData = typeof rawInvoiceData === 'string' ? JSON.parse(rawInvoiceData) : req.body || {};

    const pdfBytes = await generateInvoicePdf(invoiceData);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="factura.pdf"');
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error al generar el PDF de la factura:', error);
    res.status(500).json({ error: 'No se pudo generar la factura' });
  }
};
