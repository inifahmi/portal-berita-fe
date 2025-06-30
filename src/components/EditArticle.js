// src/components/EditArticle.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const EditArticle = () => {
    const { id } = useParams(); // Ambil ID artikel dari URL
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [status, setStatus] = useState("draft");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Mengambil data artikel yang akan diedit
    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const [articleRes, categoriesRes] = await Promise.all([
                    api.get(`/articles/${id}`),
                    api.get("/categories")
                ]);
                
                const article = articleRes.data;
                setTitle(article.title);
                setContent(article.content);
                setStatus(article.status);
                setCurrentThumbnailUrl(article.thumbnail_url);
                setSelectedCategories(article.Categories.map(cat => cat.id_category.toString()));
                
                setCategories(categoriesRes.data);

            } catch (err) {
                console.error("Gagal mengambil data artikel:", err);
                setError("Gagal memuat data artikel untuk diedit.");
            }
        };
        fetchArticleData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("status", status);
        if (thumbnailFile) { // Hanya tambahkan file jika ada yang baru dipilih
            formData.append("thumbnail", thumbnailFile);
        }
        formData.append("category_ids_str", JSON.stringify(selectedCategories));

        try {
            await api.put(`/articles/${id}`, formData);
            setSuccess("Artikel berhasil diperbarui!");
            setTimeout(() => navigate('/my-articles'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memperbarui artikel.");
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
                            <h1 className="title has-text-centered">Edit Artikel</h1>
                            <form onSubmit={handleSubmit}>
                                {/* ... (Notifikasi, input Judul, Konten, Kategori, Status) ... */}
                                {/* Bagian ini sama seperti CreateArticle.js, tapi value-nya dari state */}
                                
                                <div className="field">
                                  <label className="label">Thumbnail Saat Ini</label>
                                  <figure className="image is-16by9 mb-4">
                                      <img src={currentThumbnailUrl} alt="Thumbnail saat ini" />
                                  </figure>
                                  <label className="label">Ganti Thumbnail (Opsional)</label>
                                  <div className="file has-name is-fullwidth">
                                      {/* ... (Input file seperti di CreateArticle.js) ... */}
                                  </div>
                                </div>

                                <div className="field is-grouped is-grouped-centered mt-5">
                                    <div className="control">
                                        <button type="submit" className={`button is-link ${loading ? 'is-loading' : ''}`} disabled={loading}>
                                            Simpan Perubahan
                                        </button>
                                        <button type="button" className="button is-light ml-2" onClick={() => navigate('/my-articles')}>
                                            Batal
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

export default EditArticle;