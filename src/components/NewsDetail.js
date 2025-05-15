import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

// Dummy data simulasi fetch berdasar id
const dummyArticles = [
  {
    id: "1",
    title: "Berita Utama Hari Ini: Perkembangan Teknologi AI",
    image: "https://source.unsplash.com/900x500/?technology,ai",
    content:
      "Perkembangan teknologi AI semakin pesat dan membawa dampak besar bagi berbagai sektor industri, pendidikan, dan kesehatan. Artikel ini mengulas tren terbaru dan prediksi masa depan AI...",
    author: "Joko Widodo",
    publishedAt: "2025-05-15",
  },
  {
    id: "2",
    title: "Berita Kecil 1: Update Politik Terkini",
    image: "https://source.unsplash.com/900x500/?politics",
    content:
      "Berita politik hari ini mengangkat isu-isu penting yang sedang berkembang di negara...",
    author: "Megawati Soekarnoputri",
    publishedAt: "2025-05-14",
  },
  // ...artikel lain jika perlu
];

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = dummyArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Berita tidak ditemukan</h2>
          <button onClick={() => navigate(-1)}>Kembali</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
        <h1>{article.title}</h1>
        <p style={{ color: "#555", marginBottom: 10 }}>
          Oleh <b>{article.author}</b> - {article.publishedAt}
        </p>
        <img
          src={article.image}
          alt={article.title}
          style={{ width: "100%", borderRadius: 8, marginBottom: 20 }}
        />
        <p style={{ lineHeight: 1.6, fontSize: 18 }}>{article.content}</p>
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
