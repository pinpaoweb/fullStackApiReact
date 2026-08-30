import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { getInvoiceNumber, getInvoiceDate } from './invoiceUtils';
import JsBarcode from "jsbarcode";

const InvoicePDF = () => {
  const location = useLocation();
  
  // SOLUCIÓN: Agregamos "|| {}" y valores por defecto para evitar caídas si el estado viene vacío
  const { 
    name = 'No especificado', 
    email = 'No especificado', 
    address = 'No especificado', 
    barrio = 'No especificado', 
    municipio = 'No especificado', 
    departamento = 'No especificado', 
    cartItems = [], 
    paymentCode = 'N/A' 
  } = location.state || {};

  const total = cartItems.reduce((sum, item) => {
    const precio = item.product?.price || 0;
    return sum + (precio * item.quantity);
  }, 0);

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'letter');
    const invoiceNumber = getInvoiceNumber();
    const fecha = getInvoiceDate();

    console.log("FACTURA NUEVA:", invoiceNumber);

    // Añadir logotipo
    const logo = '/logo.png'; 
    try {
      doc.addImage(logo, 'PNG', 10, 10, 50, 20);
    } catch (e) {
      console.warn("No se pudo cargar el logo en el PDF, continuando sin él.");
    }

    // Encabezado
    doc.setLineWidth(0.5);
    doc.line(14, 70, 200, 70);
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE VENTA', 105, 18, null, null, 'center');

    // Subtítulos factura
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40);
    doc.text(`Factura No: ${invoiceNumber}`, 105, 26, null, null, 'center');
    doc.text(`Fecha: ${fecha}`, 105, 32, null, null, 'center');

    // Datos empresa
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Pinpao', 105, 42, null, null, 'center');
    doc.text('Calle 6 2-40', 105, 47, null, null, 'center');
    doc.text('Teléfono: 3012802459', 105, 52, null, null, 'center');
    doc.text('Correo: info@pinpao.co', 105, 57, null, null, 'center');

    // Información del cliente
    doc.setFontSize(12);
    let yOffset = 75;
    const lineSpacing = 10;
    const labelX = 14;
    const valueX = 60;

    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.text('Factura para:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(name, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Correo:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(email, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(address, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Barrio:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(barrio, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Municipio:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(municipio, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Departamento:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    doc.text(departamento, valueX, yOffset);

    yOffset += lineSpacing;
    doc.setFont('helvetica', 'bold');
    doc.text('Código de Pago:', labelX, yOffset);
    doc.setFont('helvetica', 'normal');
    
    // CORRECCIÓN SEGURA: Evitamos el uso directo de .toString() si es undefined
    doc.text(String(paymentCode), valueX, yOffset);

    yOffset += lineSpacing + 10; 

    // Tabla de artículos
    const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Total"];
    const tableRows = [];

    cartItems.forEach(item => {
      const nombreProducto = item.product?.name || 'Producto';
      const precioUnitario = item.product?.price || 0;
      const cantidad = item.quantity || 0;

      const productData = [
        nombreProducto,
        cantidad.toString(),
        `$${precioUnitario.toFixed(2)}`,
        `$${(precioUnitario * cantidad).toFixed(2)}`,
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yOffset,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, 
      alternateRowStyles: { fillColor: [240, 240, 240] } 
    });

    // Total
    const finalY = (doc.lastAutoTable?.finalY || yOffset) + 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: COP $${total.toFixed(2)}`, labelX, finalY);

    // Pie de página
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 150, 0); 
    doc.text('Gracias por su compra', 105, finalY + 45, null, null, 'center');
    doc.text('Por favor, conserve esta factura para sus registros', 105, finalY + 52, null, null, 'center');

    // Código de barras
    try {
      const canvas = document.createElement("canvas");
      const safeInvoiceNumber = String(invoiceNumber || Date.now());
      JsBarcode(canvas, safeInvoiceNumber, {
        format: "CODE128",
        displayValue: true,
        fontSize: 12,
      });
      const barcodeImg = canvas.toDataURL("image/png");
      doc.addImage(barcodeImg, "PNG", 14, finalY + 15, 90, 20);
    } catch (barcodeError) {
      console.error("Error generando el código de barras:", barcodeError);
    }

    // Guardar el PDF
    doc.save(`factura_${invoiceNumber}.pdf`);
  };

  return (
    <div className="payment-form">
      <h1>Factura</h1>
      <p>Nombre: {name}</p>
      <p>Correo: {email}</p>
      <p>Dirección: {address}</p>
      <p>Barrio: {barrio}</p>
      <p>Municipio: {municipio}</p>
      <p>Departamento: {departamento}</p>
      <p>Código de Pago: {paymentCode}</p>
      
      <h2>Artículos:</h2>
      {cartItems.map((item, index) => (
        <div key={item.product?.id || index}>
          <span>{item.product?.name || 'Producto'} (x{item.quantity})</span>
          <span> ${(item.product?.price || 0) * item.quantity} COP</span>
        </div>
      ))}
      
      <h2>Total: {total} COP</h2>
      <button onClick={generatePDF}>Descargar Factura en PDF</button>
      <button onClick={() => alert('Proceder al pago PSE o en efectivo')}>Proceder al Pago</button>
    </div>
  );
};
// En tu componente InvoicePDF.jsx
const handlePrint = () => {
  window.print(); // Esta es la forma más fácil de convertir a PDF usando el navegador
};

// Dentro del JSX:
<div className="invoice-actions">
  <button onClick={handlePrint} className="btn-descargar">
    Descargar Factura PDF
  </button>
  <button onClick={() => navigate('/')} className="btn-volver">
    Volver a la Tienda
  </button>
</div>

export default InvoicePDF;