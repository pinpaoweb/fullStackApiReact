// src/components/invoiceUtils.js

// 📌 Consecutivo de factura (localStorage)
export const getInvoiceNumber = () => {
  let last = localStorage.getItem("invoice_number") || 0;
  last = parseInt(last);
  last += 1;

  localStorage.setItem("invoice_number", last);

  return `FAC-${String(last).padStart(6, "0")}`;
};

// 📌 Fecha formateada
export const getInvoiceDate = () => {
  return new Date().toLocaleString("es-CO");
};