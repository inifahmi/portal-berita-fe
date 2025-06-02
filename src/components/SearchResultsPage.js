// src/components/SearchResultsPage.js
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Menggunakan useLocation untuk query params
import axios from "axios";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Hook untuk mengakses objek lokasi (termasuk query params)
  const query = new URLSearchParams(location.search).get("q"); // Ambil nilai 'q' dari URL

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Ganti URL dengan endpoint API Anda untuk pencarian artikel
        // Asumsi backend memiliki endpoint seperti /api/articles?q=keyword&status=diterbitkan
        const response = await axios.get(`http://localhost:5000/api/articles?q=${query}&status=diterbitkan`);
        setSearchResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil hasil pencarian:", err.response ? err.response.data : err.message);
        setError("Gagal memuat hasil pencarian.");
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Refresh pencarian jika query berubah

  if (loading) {
    return <p className="has-text-centered">Mencari artikel untuk "{query}"...</p>;
  }

  if (error) {
    return <p className="has-text-danger has-text-centered">{error}</p>;
  }

  return (
    <div className="container px-2 py-4">
      <h1 className="title is-4">Hasil Pencarian untuk "{query}"</h1>
      {searchResults.length > 0 ? (
        <div className="columns is-multiline">
          {searchResults.map((article) => (
            <div className="column is-one-third" key={article.id_article}>
              <Link to={`/newsdetail/${article.id_article}`}>
                <div className="card" style={{ height: '100%' }}>
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
                        {article.content ? article.content.substring(0, 100) + '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="has-text-centered mt-6">
          <div className="box">
            <p className="title is-5 has-text-grey">
              Tidak ada artikel yang cocok dengan pencarian "{query}".
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;