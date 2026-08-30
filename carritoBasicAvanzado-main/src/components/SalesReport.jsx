import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const SalesReport = ({ data = [] }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        textColor: '#333',
        background: { color: '#ffffff' }
      },
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      }
    });

    const series = chart.addAreaSeries({
      lineColor: '#2563eb',
      topColor: 'rgba(37, 99, 235, 0.4)',
      bottomColor: 'rgba(37, 99, 235, 0.05)',
      lineWidth: 2,
    });

    const ventasAgrupadas = {};

    data.forEach(item => {
      if (!item.date) return;
      const fechaFormateada = String(item.date).substring(0, 10);
      ventasAgrupadas[fechaFormateada] = (ventasAgrupadas[fechaFormateada] || 0) + Number(item.total || 0);
    });

    const chartData = Object.keys(ventasAgrupadas)
      .map(fechaStr => ({
        time: fechaStr,
        value: ventasAgrupadas[fechaStr]
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    if (chartData.length > 0) {
      series.setData(chartData);
      chart.timeScale().fitContent();
    }
    
    return () => {
      chart.remove();
    };
  }, [data]);

  return (
    <div style={{ padding: '24px', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: '#2d3748', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
        REPORTE DE VENTAS Y FACTURACIÓN
      </h1>
      
      {/* Contenedor de la Gráfica */}
      <div 
        ref={chartContainerRef} 
        style={{ 
          width: '100%', 
          height: '300px', 
          marginBottom: '32px', 
          background: '#ffffff', 
          borderRadius: '12px', 
          padding: '16px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
        }} 
      />

      {/* Tabla del Historial de Ventas */}
      <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        Historial de Transacciones Recientes
      </h2>
      
      <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', backgroundColor: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 18px', width: '180px' }}>ID Factura</th>
              <th style={{ padding: '14px 18px', width: '120px' }}>Fecha</th>
              <th style={{ padding: '14px 18px' }}>Productos</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', width: '150px' }}>Total Venta</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              [...data].reverse().map((venta) => (
                <tr 
                  key={venta._id} 
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                >
                  {/* ID Factura */}
                  <td style={{ padding: '16px 18px', fontSize: '12px', fontFamily: 'monospace', color: '#64748b', verticalAlign: 'top' }}>
                    {venta._id}
                  </td>

                  {/* Fecha */}
                  <td style={{ padding: '16px 18px', fontSize: '14px', fontWeight: '500', color: '#334155', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {venta.date ? String(venta.date).substring(0, 10) : 'N/A'}
                  </td>

                  {/* Lista de Productos Estilizada */}
                  <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                    {(() => {
                      const listaProductos = venta.items || venta.pedido;
                      
                      return listaProductos && listaProductos.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {listaProductos.map((item, index) => {
                            const nombreProd = 
                              item.nombre || 
                              (typeof item.producto === 'object' ? item.producto?.nombre : null) || 
                              'Producto';

                            const cantidadProd = item.cantidad || 1;

                            const precioProd = 
                              item.precio || 
                              (typeof item.producto === 'object' ? item.producto?.precio : null) || 
                              0;

                            const descripcionProd = 
                              item.descripcion || 
                              (typeof item.producto === 'object' ? item.producto?.descripcion : null) || 
                              '';

                            return (
                              <div 
                                key={index} 
                                style={{ 
                                  padding: '10px 14px', 
                                  backgroundColor: '#f8fafc', 
                                  borderRadius: '8px', 
                                  borderLeft: '4px solid #2563eb',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', textTransform: 'capitalize' }}>
                                    {nombreProd}
                                  </span>
                                  <span style={{ 
                                    backgroundColor: '#dbeafe', 
                                    color: '#1e40af', 
                                    fontSize: '11px', 
                                    fontWeight: '700', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px' 
                                  }}>
                                    x{cantidadProd}
                                  </span>
                                </div>

                                {precioProd > 0 && (
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', marginBottom: '4px' }}>
                                    ${Number(precioProd).toLocaleString('es-CO')}
                                  </div>
                                )}

                                {descripcionProd && (
                                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                                    {descripcionProd.length > 110 ? `${descripcionProd.substring(0, 110)}...` : descripcionProd}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>
                          Sin productos detallados
                        </span>
                      );
                    })()}
                  </td>

                  {/* Total Venta */}
                  <td style={{ padding: '16px 18px', textAlign: 'right', fontWeight: '700', color: '#16a34a', fontSize: '16px', verticalAlign: 'top' }}>
                    ${Number(venta.total || 0).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No se han registrado ventas en el sistema todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;