// src/components/ManageCategories.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios.js"

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // Menyimpan objek kategori yang sedang diedit
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Ganti URL dengan endpoint API Anda untuk mengambil daftar kategori
      const response = await api.get("/categories", config);
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil daftar kategori:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal memuat daftar kategori.");
      setLoading(false);
    }
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newCategoryName.trim()) {
      setError("Nama kategori tidak boleh kosong.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingCategory) {
        // Mode edit
        await api.put(`/categories/${editingCategory.id_category}`, {
          name: newCategoryName
        }, config);
        setMessage("Kategori berhasil diperbarui!");
        await logAdminAction(editingCategory.id_category, 'ubah_kategori', `Kategori ID ${editingCategory.id_category} diubah menjadi ${newCategoryName}`);
      } else {
        // Mode tambah
        const response = await api.post("/categories", {
          name: newCategoryName,
          created_by: currentUser.id_user // Mengisi created_by
        }, config);
        setMessage("Kategori berhasil ditambahkan!");
        await logAdminAction(response.data.id_category, 'tambah_kategori', `Kategori ID ${response.data.id_category} (${newCategoryName}) ditambahkan`);
      }

      setNewCategoryName(""); // Clear input
      setEditingCategory(null); // Exit editing mode
      fetchCategories(); // Refresh list

    } catch (err) {
      console.error("Gagal operasi kategori:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal menyimpan kategori.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"? Semua artikel yang terhubung mungkin akan kehilangan kategorinya.`)) {
      return;
    }
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      // Ganti URL dengan endpoint API Anda untuk menghapus kategori
      await api.delete(`/categories/${categoryId}`, config);
      setMessage("Kategori berhasil dihapus!");
      fetchCategories(); // Refresh list
      await logAdminAction(categoryId, 'hapus_kategori', `Kategori ID ${categoryId} (${categoryName}) dihapus`);
    } catch (err) {
      console.error("Gagal menghapus kategori:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal menghapus kategori.");
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
        target_category_id: targetId, // ID kategori yang diubah/dihapus/ditambah
        action: actionType,
        note: note
      }, config);
    } catch (logErr) {
      console.error("Gagal mencatat aksi admin:", logErr);
    }
  };

  if (loading) {
    return <p className="has-text-centered">Memuat daftar kategori...</p>;
  }

  if (error && !message) { // Tampilkan error umum jika belum ada pesan sukses/error spesifik
    return <p className="has-text-danger has-text-centered">{error}</p>;
  }

  return (
    <div className="container px-2 py-4">
      <h1 className="title is-4">Kelola Kategori</h1>
      {message && (
        <div className={`notification ${message.includes('Gagal') ? 'is-danger' : 'is-success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddOrUpdateCategory} className="box mb-4">
        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder={editingCategory ? "Edit nama kategori" : "Nama kategori baru"}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="control">
            <button type="submit" className="button is-primary">
              {editingCategory ? "Perbarui Kategori" : "Tambah Kategori"}
            </button>
          </div>
          {editingCategory && (
            <div className="control">
              <button type="button" className="button is-light" onClick={() => { setEditingCategory(null); setNewCategoryName(""); }}>
                Batal Edit
              </button>
            </div>
          )}
        </div>
        {error && <p className="help is-danger">{error}</p>}
      </form>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Kategori</th>
            <th>Dibuat Oleh</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id_category}>
              <td>{cat.id_category}</td>
              <td>{cat.name}</td>
              <td>{cat.created_by_username || cat.created_by}</td> {/* Asumsi backend bisa join dan kasih username */}
              <td>
                <button
                  className="button is-info is-small mr-2"
                  onClick={() => handleEditClick(cat)}
                >
                  Edit
                </button>
                <button
                  className="button is-danger is-small"
                  onClick={() => handleDeleteCategory(cat.id_category, cat.name)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;