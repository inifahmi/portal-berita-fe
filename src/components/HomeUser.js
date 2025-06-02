import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link untuk navigasi ke detail
import axios from "axios"; // Import axios

// Navbar sudah dirender di App.js atau di komponen layout, jadi bisa dihapus di sini
// import Navbar from "./Navbar";

export default function HomeUser() {
  const [mainArticle, setMainArticle] = useState(null);
  const [smallArticles, setSmallArticles] = useState([]);
  const [otherArticles, setOtherArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Ganti URL dengan endpoint API Anda untuk mengambil artikel
        // Endpoint ini harus bisa mengembalikan artikel yang diterbitkan
        const response = await axios.get("http://localhost:5000/api/articles?status=diterbitkan&limit=10"); // Ambil 10 artikel terbaru/terpopuler

        const articlesData = response.data; // Asumsi response.data adalah array artikel

        if (articlesData.length > 0) {
          // Ambil artikel utama (misalnya yang paling baru atau paling banyak dilihat)
          setMainArticle(articlesData[0]);
          // Ambil beberapa artikel kecil
          setSmallArticles(articlesData.slice(1, 5)); // 4 artikel kecil
          // Ambil artikel lainnya
          setOtherArticles(articlesData.slice(5));
        } else {
          setMainArticle(null);
          setSmallArticles([]);
          setOtherArticles([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4">Memuat berita...</p>
              <progress className="progress is-primary" max="100">60%</progress>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4 has-text-danger">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> -- Navbar sudah dipindahkan ke App.js atau komponen Layout*/}
      <div className="container is-max-desktop px-2 py-4">
        {/* Main News Section */}
        {mainArticle && (
          <div className="box has-background-light mb-5 p-4">
            <div className="columns">
              {/* Berita Utama Besar */}
              <div className="column is-8">
                <Link to={`/newsdetail/${mainArticle.id_article}`}>
                  <div className="box p-0 mb-2" style={{ overflow: "hidden" }}>
                    <img
                      src={mainArticle.thumbnail_url}
                      alt={mainArticle.title}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <h3 className="title is-5 mb-1">{mainArticle.title}</h3>
                  <p className="is-size-6 has-text-grey">
                    {mainArticle.content.substring(0, 150)}... {/* Tampilkan sebagian konten */}
                  </p>
                </Link>
              </div>

              {/* Berita Kecil Vertikal */}
              <div className="column">
                {smallArticles.map((item) => (
                  <Link to={`/newsdetail/${item.id_article}`} key={item.id_article}>
                    <div className="box mb-2 p-2">
                      <div className="columns is-mobile is-vcentered is-gapless">
                        <div className="column is-4">
                          <div className="image">
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                            />
                          </div>
                        </div>
                        <div className="column">
                          <p className="is-size-7 px-2">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Berita Lain Section */}
        {otherArticles.length > 0 && (
          <div>
            <h3 className="title is-5 mb-4 pb-2" style={{ borderBottom: "1px solid #dbdbdb" }}>Berita Lain</h3>

            <div className="columns is-multiline">
              {otherArticles.map((item) => (
                <div className="column is-4" key={item.id_article}>
                  <Link to={`/newsdetail/${item.id_article}`}>
                    <div className="box p-0 mb-2" style={{ overflow: "hidden" }}>
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        style={{ width: "100%" }}
                      />
                    </div>
                    <h3 className="title is-6 mb-1">{item.title}</h3>
                    <p className="is-size-7 has-text-grey">
                      {item.content.substring(0, 100)}... {/* Tampilkan sebagian konten */}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!mainArticle && smallArticles.length === 0 && otherArticles.length === 0 && (
          <div className="has-text-centered mt-6">
            <div className="box">
              <p className="title is-5 has-text-grey">
                Tidak ada berita untuk ditampilkan
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}