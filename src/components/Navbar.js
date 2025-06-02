import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Gunakan state untuk user
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]); // State untuk kategori dinamis

  useEffect(() => {
    // Ambil data user dari localStorage saat komponen dimuat
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Ambil kategori dari backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories"); // Ganti dengan endpoint kategori Anda
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback ke kategori hardcode jika API gagal
        setCategories(["Berita Politik", "Teknologi", "Olahraga", "Hiburan"]);
      }
    };
    fetchCategories();
  }, []); // [] agar hanya berjalan sekali saat mount

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    localStorage.removeItem("user"); // Hapus info user
    setUser(null); // Reset state user
    navigate("/login"); // Arahkan ke login
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implementasi pencarian sebenarnya: arahkan ke halaman hasil pencarian
    navigate(`/search?q=${searchTerm}`); // Contoh: /search?q=teknologi
    setSearchTerm("");
  };

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item has-text-weight-bold">
            Portal Berita
          </Link>
        </div>

        <div className="navbar-menu is-active">
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Home
            </Link>

            <div className={`navbar-item has-dropdown ${showCategory ? 'is-active' : ''}`}>
              <a
                className="navbar-link"
                onClick={() => setShowCategory(!showCategory)}
              >
                Kategori
              </a>

              <div className="navbar-dropdown">
                {categories.map((cat) => (
                  <Link key={cat.id_category || cat} to={`/category/${cat.name || cat}`} className="navbar-item">
                    {cat.name || cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tautan khusus peran */}
            {user && (user.role === 'admin_utama' || user.role === 'admin_biasa') && (
                <Link to="/admindashboard" className="navbar-item">
                    Dashboard Admin
                </Link>
            )}
            {user && (user.role === 'admin_utama' || user.role === 'admin_biasa' || user.role === 'jurnalis') && (
                <Link to="/create-article" className="navbar-item">
                    Buat Artikel
                </Link>
            )}
            {/* Tambahkan link ke halaman manajemen user/kategori jika ada role yang diizinkan */}
            {user && user.role === 'admin_utama' && (
                <Link to="/manage-users" className="navbar-item">
                    Kelola Pengguna
                </Link>
            )}
            {user && (user.role === 'admin_utama' || user.role === 'admin_biasa') && (
                <Link to="/manage-categories" className="navbar-item">
                    Kelola Kategori
                </Link>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <form onSubmit={handleSearchSubmit} style={{ width: "250px" }}>
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      className="input"
                      type="text"
                      placeholder="Cari berita..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <button type="submit" className="button is-dark">
                      Cari
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {user ? (
              <>
                <Link to="/profile" className="navbar-item"> {/* Link ke halaman profil pengguna */}
                  Halo, {user.username}
                </Link>
                <div className="navbar-item">
                  <button
                    onClick={handleLogout}
                    className="button is-danger is-small"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="navbar-item">
                  <Link to="/login" className="button is-primary is-small">
                    Login
                  </Link>
                </div>
                <div className="navbar-item">
                  <Link to="/register" className="button is-light is-small">
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;