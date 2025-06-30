// src/components/TakedownContent.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Pastikan path ini benar

const TakedownContent = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ isOpen: false, article: null });

    const fetchPublishedArticles = async () => {
        try {
            setLoading(true);
            // Header otorisasi ditangani oleh interceptor
            const response = await api.get('/articles?status=diterbitkan');
            setArticles(response.data);
        } catch (err) {
            console.error("Gagal mengambil artikel terbit:", err);
            setError('Gagal memuat artikel. Pastikan Anda memiliki hak akses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublishedArticles();
    }, []);

    const handleTakedown = async (articleId) => {
    try {
        // --- PERUBAHAN DI SINI ---
        // Menggunakan metode PATCH ke rute status yang baru
        await api.patch(`/articles/${articleId}/status`, { status: 'take_down' });
        
        fetchPublishedArticles(); // Refresh list
        closeModal();
    } catch (err) {
        console.error("Gagal takedown artikel:", err);
        setError('Gagal melakukan takedown pada artikel.');
    }
    };

    const openTakedownModal = (article) => setModal({ isOpen: true, article });
    const closeModal = () => setModal({ isOpen: false, article: null });

    if (loading) return <div className="container p-4">Memuat artikel...</div>;
    if (error) return <div className="notification is-danger m-4">{error}</div>;

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Take Down Konten</h1>
                <p className="subtitle">Hapus sementara artikel yang sudah terbit dari tampilan publik.</p>
                <div className="box">
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>Judul Artikel</th>
                                <th>Penulis</th>
                                <th>Diterbitkan pada</th>
                                <th className="has-text-centered">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? (
                                articles.map(article => (
                                    <tr key={article.id_article}>
                                        <td>
                                            <Link to={`/newsdetail/${article.id_article}`} target="_blank" rel="noopener noreferrer">
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td>{article.author?.username || 'N/A'}</td>
                                        <td>{new Date(article.published_at).toLocaleDateString('id-ID')}</td>
                                        <td className="has-text-centered">
                                            <button 
                                                className="button is-warning is-small"
                                                onClick={() => openTakedownModal(article)}
                                            >
                                                Take Down
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="has-text-centered">Tidak ada artikel yang sedang diterbitkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Konfirmasi Takedown */}
            {modal.isOpen && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Konfirmasi Take Down</p>
                            <button className="delete" aria-label="close" onClick={closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            <p>Anda yakin ingin melakukan takedown pada artikel "<strong>{modal.article?.title}</strong>"? Artikel ini akan disembunyikan dari publik.</p>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-warning" onClick={() => handleTakedown(modal.article.id_article)}>Ya, Lakukan Take Down</button>
                            <button className="button" onClick={closeModal}>Batal</button>
                        </footer>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TakedownContent;
