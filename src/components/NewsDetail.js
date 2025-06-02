import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import Link
import axios from "axios"; // Import axios
import CommentsSection from "./CommentsSection"; // Import CommentsSection
import LikeButton from "./LikeButton"; // Import LikeButton

export default function NewsDetail() {
  const { id } = useParams(); // id_article
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ganti URL dengan endpoint API Anda untuk mengambil detail artikel
        const response = await axios.get(`http://localhost:5000/api/articles/${id}`); // Ambil artikel berdasarkan ID
        setArticle(response.data);

        // Setelah mengambil artikel, kirim permintaan untuk menginkrementasi view_count
        // Pastikan endpoint ini dibuat di backend dan tidak memerlukan autentikasi
        await axios.patch(`http://localhost:5000/api/articles/${id}/view`);

        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil detail artikel:", err.response ? err.response.data : err.message);
        setError("Artikel tidak ditemukan atau terjadi kesalahan.");
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // id sebagai dependency agar fetch ulang jika id berubah

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4">Memuat detail berita...</p>
              <progress className="progress is-primary" max="100">60%</progress>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Artikel tidak ditemukan</h2>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
        <h1 className="title is-3">{article.title}</h1> {/* Judul yang lebih besar */}
        <p style={{ color: "#555", marginBottom: 10 }}>
          Oleh <b>{article.author_username || `Pengguna ID ${article.author_id}`}</b>{" "}
          - {new Date(article.published_at || article.created_at).toLocaleDateString("id-ID", {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
        <img
          src={article.thumbnail_url}
          alt={article.title}
          style={{ width: "100%", borderRadius: 8, marginBottom: 20 }}
        />
        <div className="content" style={{ lineHeight: 1.6, fontSize: 18 }}>
          {/* Menggunakan div content Bulma untuk styling paragraf */}
          <p>{article.content}</p>
        </div>

        {/* Bagian Like */}
        <div className="mt-4 mb-4">
          <LikeButton articleId={article.id_article} />
        </div>

        {/* Bagian Komentar */}
        <CommentsSection articleId={article.id_article} />

        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 20,
            padding: "10px 15px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Kembali
        </button>
      </div>
    </>
  );
}