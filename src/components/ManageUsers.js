// src/components/ManageUsers.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios.js"

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Pesan sukses/error untuk operasi
  const currentUser = JSON.parse(localStorage.getItem("user")); // Pengguna yang sedang login

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Ganti URL dengan endpoint API Anda untuk mengambil daftar pengguna
      const response = await api.get("/users", config);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil daftar pengguna:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal memuat daftar pengguna.");
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Hanya admin_utama yang bisa mengubah peran pengguna lain
    if (currentUser.role !== 'admin_utama' || userId === currentUser.id_user) {
        setMessage("Anda tidak memiliki izin untuk mengubah peran ini atau tidak bisa mengubah peran sendiri.");
        return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Ganti URL dengan endpoint API Anda untuk mengubah peran pengguna
      await api.patch(`/users/${userId}/role`, { role: newRole }, config);

      setMessage(`Peran pengguna berhasil diubah menjadi ${newRole}.`);
      fetchUsers(); // Refresh daftar pengguna
      // Kirim log admin
      await logAdminAction(userId, 'ubah_peran_pengguna', `Peran pengguna ID ${userId} diubah menjadi ${newRole}`);

    } catch (err) {
      console.error("Gagal mengubah peran:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || "Gagal mengubah peran pengguna.");
    }
  };

  const handleSuspendUser = async (userId, usernameToSuspend) => {
    // Hanya admin_utama yang bisa men-suspend pengguna lain
    if (currentUser.role !== 'admin_utama' || userId === currentUser.id_user) {
        setMessage("Anda tidak memiliki izin untuk men-suspend ini atau tidak bisa men-suspend diri sendiri.");
        return;
    }

    // Konfirmasi sebelum men-suspend
    if (!window.confirm(`Apakah Anda yakin ingin men-suspend pengguna ${usernameToSuspend}?`)) {
        return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Ganti URL dengan endpoint API Anda untuk men-suspend pengguna (mengatur is_active ke false)
      // Karena kita hilangkan is_active, ini akan menjadi hard delete atau Anda bisa tambahkan kolom is_active lagi
      // Untuk tujuan demo ini, kita akan simulasikan sebagai delete
      await api.delete(`/users/${userId}`, config);

      setMessage(`Pengguna ${usernameToSuspend} berhasil di-suspend (dihapus).`);
      fetchUsers(); // Refresh daftar pengguna
      // Kirim log admin
      await logAdminAction(userId, 'suspend_pengguna', `Pengguna ID ${userId} (${usernameToSuspend}) disuspend/dihapus`);

    } catch (err) {
      console.error("Gagal men-suspend pengguna:", err.response ? err.response.data : err.message);
      setMessage(err.response?.data?.message || "Gagal men-suspend pengguna.");
    }
  };

  const logAdminAction = async (targetId, actionType, note) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await api.post("/admin/logs", {
        admin_id: currentUser.id_user,
        target_user_id: targetId, // Contoh: ID user yang diubah/dihapus
        action: actionType,
        note: note
      }, config);
    } catch (logErr) {
      console.error("Gagal mencatat aksi admin:", logErr);
    }
  };


  if (loading) {
    return <p className="has-text-centered">Memuat daftar pengguna...</p>;
  }

  if (error) {
    return <p className="has-text-danger has-text-centered">{error}</p>;
  }

  return (
    <div className="container px-2 py-4">
      <h1 className="title is-4">Kelola Pengguna</h1>
      {message && (
        <div className={`notification ${message.includes('Gagal') ? 'is-danger' : 'is-success'}`}>
          {message}
        </div>
      )}
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Nama Lengkap</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_user}>
              <td>{user.id_user}</td>
              <td>{user.username}</td>
              <td>{user.nama_lengkap}</td>
              <td>{user.email}</td>
              <td>
                {/* Hanya admin_utama yang bisa mengubah peran */}
                {currentUser.role === 'admin_utama' && user.id_user !== currentUser.id_user ? (
                  <div className="select is-small">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id_user, e.target.value)}
                    >
                      <option value="admin_utama">Admin Utama</option>
                      <option value="admin_biasa">Admin Biasa</option>
                      <option value="jurnalis">Jurnalis</option>
                      <option value="pembaca">Pembaca</option>
                    </select>
                  </div>
                ) : (
                  <span>{user.role}</span>
                )}
              </td>
              <td>
                {/* Hanya admin_utama dan tidak bisa men-suspend diri sendiri */}
                {currentUser.role === 'admin_utama' && user.id_user !== currentUser.id_user && (
                  <button
                    className="button is-danger is-small"
                    onClick={() => handleSuspendUser(user.id_user, user.username)}
                  >
                    Suspend
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;