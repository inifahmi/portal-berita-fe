
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [searchTerm, setSearchTerm] = useState("");
  const [showCategory, setShowCategory] = useState(false);

  const categories = ["Berita Politik", "Teknologi", "Olahraga", "Hiburan"];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Mencari: ${searchTerm}`);
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
                  <a key={cat} className="navbar-item">
                    {cat}
                  </a>
                ))}
              </div>
            </div>
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

            {user && (
              <>
                <div className="navbar-item">
                  Halo, {user.username}
                </div>
                <div className="navbar-item">
                  <button
                    onClick={handleLogout}
                    className="button is-danger is-small"
                  >
                    Logout
                  </button>
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