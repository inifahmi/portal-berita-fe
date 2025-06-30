// src/components/CreateArticle.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const CreateArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [status, setStatus] = useState("draft");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mengambil daftar kategori dari API saat komponen dimuat
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Gagal mengambil kategori:", err);
                setError("Gagal memuat daftar kategori.");
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handleCategoryChange = (e) => {
        const value = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedCategories(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!thumbnailFile) {
            setError("Thumbnail gambar wajib diunggah.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("status", status);
        formData.append("thumbnail", thumbnailFile);
        formData.append("category_ids_str", JSON.stringify(selectedCategories));

        try {
            const response = await api.post("/articles", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess("Artikel berhasil dibuat! Anda akan diarahkan...");
            
            setTimeout(() => {
                navigate(`/newsdetail/${response.data.data.id_article}`);
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Gagal membuat artikel.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-two-thirds">
                        <div className="box">
                            <h1 className="title has-text-centered">Buat Artikel Baru</h1>
                            
                            <form onSubmit={handleSubmit}>
                                {error && <div className="notification is-danger is-light">{error}</div>}
                                {success && <div className="notification is-success is-light">{success}</div>}

                                <div className="field">
                                    <label className="label">Judul Artikel</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder="Masukkan judul artikel"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Thumbnail Gambar</label>
                                    <div className="control">
                                        <div className="file has-name is-fullwidth">
                                            <label className="file-label">
                                                <input 
                                                    className="file-input" 
                                                    type="file" 
                                                    name="thumbnail"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    required
                                                    disabled={loading}
                                                />
                                                <span className="file-cta">
                                                    <span className="file-icon">
                                                        <i className="fas fa-upload"></i>
                                                    </span>
                                                    <span className="file-label">
                                                        Pilih gambar…
                                                    </span>
                                                </span>
                                                <span className="file-name">
                                                    {thumbnailFile ? thumbnailFile.name : "Belum ada file terpilih"}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="help">Ukuran file maksimal: 5MB.</p>
                                </div>

                                <div className="field">
                                    <label className="label">Konten Artikel</label>
                                    <div className="control">
                                        <textarea
                                            className="textarea"
                                            placeholder="Tulis konten artikel di sini..."
                                            rows="10"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Kategori</label>
                                    <div className="control">
                                        <div className="select is-multiple is-fullwidth">
                                            <select multiple size="3" value={selectedCategories} onChange={handleCategoryChange} disabled={loading}>
                                                {categories.map((cat) => (
                                                    <option key={cat.id_category} value={cat.id_category}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="help">Pilih satu atau beberapa kategori (tahan Ctrl/Cmd untuk memilih banyak).</p>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Status Artikel</label>
                                    <div className="control">
                                        <div className="select is-fullwidth">
                                            <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                                                <option value="draft">Simpan sebagai Draft</option>
                                                <option value="menunggu">Kirim untuk Review</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="field is-grouped is-grouped-centered mt-5">
                                    <div className="control">
                                        <button type="submit" className={`button is-link ${loading ? 'is-loading' : ''}`} disabled={loading}>
                                            Simpan Artikel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateArticle;
