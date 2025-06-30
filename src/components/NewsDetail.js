// src/components/NewsDetail.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import CommentsSection from "./CommentsSection";
import LikeButton from "./LikeButton";

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL untuk gambar placeholder
    const placeholderImage = 'https://placehold.co/800x400/EBF0F5/363636?text=Gambar+Tidak+Tersedia';

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(`/articles/${id}`);
                setArticle(response.data);
                api.patch(`/articles/${id}/view`);
            } catch (err) {
                console.error("Gagal mengambil detail artikel:", err);
                setError("Artikel tidak ditemukan atau terjadi kesalahan.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    // Fungsi untuk menangani error saat gambar gagal dimuat
    const handleImageError = (e) => {
        e.target.onerror = null; // Mencegah loop error jika placeholder juga gagal
        e.target.src = placeholderImage;
    };

    if (loading) return <div className="container has-text-centered p-4">Memuat detail berita...</div>;
    if (error) return <div className="container has-text-centered p-4">{error}</div>;
    if (!article) return <div className="container has-text-centered p-4">Artikel tidak ditemukan.</div>;

    return (
        <>
            <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
                <h1 className="title is-3">{article.title}</h1>
                <p style={{ color: "#555", marginBottom: 10 }}>
                    Oleh <b>{article.author ? article.author.username : `Pengguna ID ${article.author_id}`}</b>{" "}
                    - {new Date(article.published_at || article.createdAt).toLocaleDateString("id-ID", {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </p>
                
                {/* --- PERBAIKAN TAG GAMBAR --- */}
                <img 
                    src={article.thumbnail_url || placeholderImage} 
                    alt={article.title} 
                    onError={handleImageError} // Menambahkan event handler onError
                    style={{ width: "100%", borderRadius: 8, marginBottom: 20, objectFit: 'cover', height: '400px' }} 
                />
                
                <div className="content" style={{ lineHeight: 1.6, fontSize: 18 }} dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
                
                <div className="mt-4 mb-4">
                    <LikeButton articleId={article.id_article} />
                </div>

                <CommentsSection articleId={article.id_article} />

                <button onClick={() => navigate(-1)} className="button mt-5">Kembali</button>
            </div>
        </>
    );
}
