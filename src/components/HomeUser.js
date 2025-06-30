// src/components/HomeUser.js

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import NewsCard from "./NewsCard"; // Impor komponen kartu berita yang baru

const HomeUser = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                // Mengambil artikel yang statusnya sudah 'diterbitkan'
                const response = await api.get("/articles?status=diterbitkan");
                setArticles(response.data);
            } catch (err) {
                console.error("Gagal mengambil artikel:", err);
                setError("Tidak dapat memuat berita saat ini. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="container has-text-centered p-4">Memuat berita terbaru...</div>;
    }

    if (error) {
        return <div className="container has-text-centered p-4">{error}</div>;
    }

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Berita Terbaru</h1>
                <div className="columns is-multiline">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <NewsCard key={article.id_article} article={article} />
                        ))
                    ) : (
                        <div className="column">
                            <p>Tidak ada berita untuk ditampilkan.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HomeUser;