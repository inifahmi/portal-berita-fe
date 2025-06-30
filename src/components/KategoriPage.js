import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axios.js"

const CategoryPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticlesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/articles?category=${name}&status=diterbitkan`);
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch articles by category:", err);
        setError(`Gagal memuat artikel untuk kategori "${name}".`);
        setLoading(false);
      }
    };

    fetchArticlesByCategory();
  }, [name]);

  const handleArticleClick = (articleId) => {
    navigate(`/newsdetail/${articleId}`);
  };

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4">Memuat artikel kategori "{name}"...</p>
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
              <p className="title is-5 has-text-danger">{error}</p>
              <button
                className="button"
                style={{ backgroundColor: "#343a40", color: "white" }}
                onClick={() => navigate('/')}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-four-fifths">

                {/* Header */}
                <div className="has-text-centered mb-5">
                  <h1 className="title is-4 mb-4" style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                    Kategori "{name}"
                  </h1>
                </div>

                {/* Articles Grid */}
                {articles.length > 0 ? (
                  <div className="columns is-multiline">
                    {articles.map((article) => (
                      <div key={article.id_article} className="column is-one-third">
                        <div
                          className="card"
                          style={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            height: '100%'
                          }}
                          onClick={() => handleArticleClick(article.id_article)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 3px rgba(10, 10, 10, 0.1)';
                          }}
                        >
                          <div className="card-image">
                            <figure className="image is-16by9">
                              <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                style={{ objectFit: 'cover' }}
                              />
                            </figure>
                          </div>
                          <div className="card-content">
                            <div className="content">
                              <h3 className="title is-6 mb-2" style={{ fontWeight: 'bold' }}>
                                {article.title}
                              </h3>
                              <p className="subtitle is-7 has-text-grey-dark" style={{ lineHeight: '1.4' }}>
                                {article.content ? article.content.substring(0, 100) + '...' : ''} {/* Perbaikan di sini */}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State - Perhatikan perubahan di sini
                  <div className="has-text-centered mt-6">
                    <div className="box">
                      <p className="title is-5 has-text-grey">
                        Tidak ada artikel dalam kategori ini
                      </p>
                      <p className="subtitle is-6 has-text-grey mb-4">
                        Silakan coba kategori lain atau kembali ke beranda
                      </p>
                      <button
                        className="button"
                        style={{ backgroundColor: "#343a40", color: "white" }}
                        onClick={() => navigate('/')}
                      >
                        Kembali ke Beranda
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;