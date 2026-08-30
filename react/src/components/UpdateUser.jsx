import { useState, useEffect } from 'react'; // Eliminamos 'React' y 'useNavigate'
import axios from 'axios';

const UpdateUser = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ELIMINAMOS ESTA LÍNEA: const navigate = useNavigate();
  
  // ... resto de tu código
  useEffect(() => {
    setUser({
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || '',
      password: ''
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');

    // 1. Preparamos el objeto solo con los campos modificados
    const updatedUser = {};
    if (user.username && user.username !== localStorage.getItem('username')) {
      updatedUser.username = user.username;
    }
    if (user.email && user.email !== localStorage.getItem('email')) {
      updatedUser.email = user.email;
    }
    if (user.password) {
      updatedUser.password = user.password;
    }

    // 2. Validación de cambios
    if (Object.keys(updatedUser).length === 0) {
      setError('No hay cambios para actualizar');
      return;
    }

    try {
      // 3. Realizamos la petición
      const response = await axios.put(
        'http://localhost:5000/api/auth/update',
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 4. Actualizamos el localStorage localmente
      if (updatedUser.username) localStorage.setItem('username', response.data.user.username);
      if (updatedUser.email) localStorage.setItem('email', response.data.user.email);

      setSuccess('Datos actualizados exitosamente');
      setUser({ ...user, password: '' }); // Limpiamos el campo password
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      // 🔍 ESTO NOS DIRÁ LA VERDAD EN LA CONSOLA DEL NAVEGADOR (F12)
      console.error("Detalle del error del servidor:", err.response?.data);
      
      setError(err.response?.data?.error || 'Error al actualizar los datos');
    }
  };

  return (
    <div className="update-user-form">
      <h2>Actualizar Datos del Usuario</h2>
      {error && <p className="error" style={{color: 'red'}}>{error}</p>}
      {success && <p className="success" style={{color: 'green'}}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de Usuario:</label>
          <input type="text" name="username" value={user.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Dejar vacío para no cambiar" />
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default UpdateUser;