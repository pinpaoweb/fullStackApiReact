const upstreamBaseUrl = 'https://apireact1-1.onrender.com';

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'https://react1api.vercel.app');
    const invoiceData = url.searchParams.get('invoiceData');

    const upstreamResponse = await fetch(`${upstreamBaseUrl}/api/invoices/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invoiceData: invoiceData ? JSON.parse(invoiceData) : {}
      })
    });

    const pdfBuffer = Buffer.from(await upstreamResponse.arrayBuffer());

    res.setHeader('Content-Type', upstreamResponse.headers.get('content-type') || 'application/pdf');
    res.setHeader('Content-Disposition', upstreamResponse.headers.get('content-disposition') || 'attachment; filename="factura.pdf"');
    res.status(upstreamResponse.status).send(pdfBuffer);
  } catch (error) {
    console.error('Error proxying invoice PDF:', error);
    res.status(500).json({ error: 'No se pudo generar la factura' });
  }
};
