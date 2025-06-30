// src/components/MyArticles.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MyArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyArticles = async () => {
            try {
                setLoading(true);
                const response = await api.get('/articles/my-articles');
                setArticles(response.data);
            } catch (err) {
                console.error("Gagal mengambil artikel saya:", err);
                setError('Gagal memuat artikel Anda.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyArticles();
    }, []);

    const getStatusChip = (status) => {
        const statusMap = {
            'draft': { text: 'Draft', class: 'is-light' },
            'menunggu': { text: 'Menunggu Review', class: 'is-warning' },
            'diterbitkan': { text: 'Diterbitkan', class: 'is-success' },
            'ditolak': { text: 'Ditolak', class: 'is-danger' },
            'take_down': { text: 'Take Down', class: 'is-dark' }
        };
        const statusInfo = statusMap[status] || { text: status, class: 'is-light' };
        return <span className={`tag ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    if (loading) return <p className="p-4 has-text-centered">Memuat artikel Anda...</p>;
    if (error) return <p className="notification is-danger m-4">{error}</p>;

    return (
        <section className="section">
            <div className="container">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                    <div>
                        <h1 className="title">Artikel Saya</h1>
                        <p className="subtitle">Kelola semua artikel yang telah Anda buat.</p>
                    </div>
                    <Link to="/create-article" className="button is-primary">
                        + Buat Artikel Baru
                    </Link>
                </div>
                <hr />
                <div className="box">
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>Judul Artikel</th>
                                <th className="has-text-centered">Status</th>
                                <th>Tanggal Update</th>
                                <th className="has-text-centered">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? articles.map(article => (
                                <tr key={article.id_article}>
                                    <td>
                                        <Link to={`/newsdetail/${article.id_article}`} title="Lihat pratinjau">
                                            {article.title}
                                        </Link>
                                    </td>
                                    <td className="has-text-centered">
                                        {getStatusChip(article.status)}
                                    </td>
                                    <td>{new Date(article.updatedAt).toLocaleDateString('id-ID')}</td>
                                    <td className="has-text-centered">
                                        <button 
                                            className="button is-info is-small"
                                            onClick={() => navigate(`/edit-article/${article.id_article}`)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="has-text-centered">Anda belum membuat artikel.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default MyArticles;

