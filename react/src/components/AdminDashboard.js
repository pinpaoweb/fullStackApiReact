/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Cargar usuarios al entrar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Ajusta la URL según tu puerto de backend
      const res = await axios.get('http://localhost:5000/api/auth/usuarios');
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await axios.delete(`http://localhost:5000/api/auth/usuarios/${id}`);
      fetchUsers(); // Recargar lista
    }
  };

  const updateRole = async (id, newRole) => {
    await axios.put(`http://localhost:5000/api/auth/usuarios/${id}`, { role: newRole });
    fetchUsers(); // Recargar lista
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select value={user.role} onChange={(e) => updateRole(user._id, e.target.value)}>
                  <option value="usuario">Usuario</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;