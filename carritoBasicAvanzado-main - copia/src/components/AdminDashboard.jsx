import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/sales');
        setSales(res.data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []); // El array vacío asegura que esto solo se ejecute al cargar el Dashboard

  // Cálculo del total (usamos un condicional por si sales está vacío al inicio)
  const total = sales.reduce((acc, s) => acc + (s.total || 0), 0);

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Total ventas: ${total.toLocaleString()}</h2>
    </div>
  );
}

export default Dashboard;