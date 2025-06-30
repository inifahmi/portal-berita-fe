// src/components/SearchResultsPage.js

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios.js";
import NewsCard from "./NewsCard"; // Menggunakan kembali komponen NewsCard

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

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
                // Endpoint untuk pencarian artikel yang sudah diterbitkan
                const response = await api.get(`/articles?q=${query}&status=diterbitkan`);
                setSearchResults(response.data);
            } catch (err) {
                console.error("Gagal mengambil hasil pencarian:", err);
                setError("Gagal memuat hasil pencarian.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // Refresh pencarian jika query di URL berubah

    if (loading) {
        return <p className="has-text-centered p-5">Mencari artikel untuk "{query}"...</p>;
    }

    if (error) {
        return <p className="notification is-danger m-4">{error}</p>;
    }

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Hasil Pencarian untuk "{query}"</h1>
                <div className="columns is-multiline">
                    {searchResults.length > 0 ? (
                        // Menggunakan komponen NewsCard untuk menampilkan hasil
                        searchResults.map((article) => (
                            <NewsCard key={article.id_article} article={article} />
                        ))
                    ) : (
                        <div className="column">
                            <div className="box has-text-centered">
                                <p className="title is-5 has-text-grey">
                                    Tidak ada artikel yang cocok dengan pencarian Anda.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SearchResultsPage;
