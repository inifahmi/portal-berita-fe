import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios.js";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook untuk mendeteksi perubahan URL
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCategoryDropdownActive, setCategoryDropdownActive] = useState(false);
    const [categories, setCategories] = useState([]);
    const dropdownRef = useRef(null);

    // Efek ini akan berjalan setiap kali Anda berpindah halaman.
    // Ini memastikan status login di Navbar selalu sinkron.
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            setUser(storedUser ? JSON.parse(storedUser) : null);
        } catch (error) {
            console.error("Gagal membaca data user, membersihkan localStorage:", error);
            localStorage.clear();
            setUser(null);
        }
    }, [location.pathname]);

    // Efek ini hanya berjalan sekali untuk mengambil data kategori
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchCategories();
    }, []);

    // Efek untuk menangani klik di luar dropdown kategori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setCategoryDropdownActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/login");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
            setSearchTerm("");
        }
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
                        <Link to="/" className="navbar-item">Home</Link>

                        <div
                            className={`navbar-item has-dropdown ${isCategoryDropdownActive ? 'is-active' : ''}`}
                            ref={dropdownRef}
                        >
                            <a className="navbar-link" onClick={() => setCategoryDropdownActive(!isCategoryDropdownActive)}>
                                Kategori
                            </a>
                            <div className="navbar-dropdown">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id_category}
                                        to={`/category/${cat.name}`}
                                        className="navbar-item"
                                        onClick={() => setCategoryDropdownActive(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {user && (user.role === 'admin_utama' || user.role === 'admin_biasa' || user.role === 'jurnalis') && (
                            <Link to="/my-articles" className="navbar-item">Artikel Saya</Link>
                        )}
                        {user && (user.role === 'admin_utama' || user.role === 'admin_biasa') && (
                            <Link to="/admindashboard" className="navbar-item">Dashboard</Link>
                        )}
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="field has-addons">
                                    <div className="control"><input className="input is-small" type="text" placeholder="Cari berita..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                                    <div className="control"><button type="submit" className="button is-dark is-small">Cari</button></div>
                                </div>
                            </form>
                        </div>

                        {user ? (
                            <>
                                <div className="navbar-item"><p className="has-text-grey-light">Halo, {user.username}</p></div>
                                <div className="navbar-item"><button onClick={handleLogout} className="button is-danger is-small">Logout</button></div>
                            </>
                        ) : (
                            <div className="navbar-item">
                                <div className="buttons">
                                    <Link to="/login" className="button is-primary is-small">Login</Link>
                                    <Link to="/register" className="button is-light is-small">Register</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
