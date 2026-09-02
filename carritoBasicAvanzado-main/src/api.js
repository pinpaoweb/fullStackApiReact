const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://apireact1.onrender.com'; // <-- Pega aquí tu URL exacta de Render

export default API_URL;