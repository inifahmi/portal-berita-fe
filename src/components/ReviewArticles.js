// src/components/ReviewArticles.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Pastikan path ini benar

const ReviewArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ isOpen: false, article: null });

    const fetchPendingArticles = async () => {
        try {
            setLoading(true);
            // Anda tidak perlu menambahkan header di sini, axios interceptor akan menanganinya
            const response = await api.get('/articles?status=menunggu');
            setArticles(response.data);
        } catch (err) {
            console.error("Gagal mengambil artikel menunggu:", err);
            setError('Gagal memuat artikel untuk direview. Pastikan Anda memiliki hak akses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingArticles();
    }, []);

    const handleAction = async (articleId, newStatus) => {
    try {
        // --- PERUBAHAN DI SINI ---
        // Menggunakan metode PATCH ke rute status yang baru
        await api.patch(`/articles/${articleId}/status`, { status: newStatus });
        
        fetchPendingArticles(); // Refresh list setelah aksi
        if (modal.isOpen) closeModal();
    } catch (err) {
        console.error("Gagal update status artikel:", err);
        setError('Gagal memperbarui status artikel.');
    }
};

    const openRejectModal = (article) => setModal({ isOpen: true, article });
    const closeModal = () => setModal({ isOpen: false, article: null });

    if (loading) return <div className="container p-4">Memuat artikel...</div>;
    if (error) return <div className="notification is-danger m-4">{error}</div>;

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Review Artikel Menunggu Persetujuan</h1>
                <p className="subtitle">Setujui atau tolak artikel yang dikirim oleh jurnalis.</p>
                <div className="box">
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>Judul Artikel</th>
                                <th>Penulis</th>
                                <th>Dikirim pada</th>
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
                                        <td>{new Date(article.createdAt).toLocaleDateString('id-ID')}</td>
                                        <td className="has-text-centered">
                                            <div className="buttons is-centered">
                                                <button 
                                                    className="button is-success is-small"
                                                    onClick={() => handleAction(article.id_article, 'diterbitkan')}
                                                >
                                                    Setujui
                                                </button>
                                                <button 
                                                    className="button is-danger is-small"
                                                    onClick={() => openRejectModal(article)}
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="has-text-centered">Tidak ada artikel yang menunggu review.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Konfirmasi Tolak */}
            {modal.isOpen && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={closeModal}></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Konfirmasi Penolakan</p>
                            <button className="delete" aria-label="close" onClick={closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            <p>Anda yakin ingin menolak artikel berjudul "<strong>{modal.article?.title}</strong>"? Aksi ini akan mengubah status menjadi 'ditolak'.</p>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-danger" onClick={() => handleAction(modal.article.id_article, 'ditolak')}>Ya, Tolak Artikel</button>
                            <button className="button" onClick={closeModal}>Batal</button>
                        </footer>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReviewArticles;