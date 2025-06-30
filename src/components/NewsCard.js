// src/components/NewsCard.js

import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ article }) => {

    // URL untuk gambar placeholder
    const placeholderImage = 'https://placehold.co/600x400/EBF0F5/363636?text=Gambar+Tidak+Tersedia';

    // Fungsi untuk menangani error saat gambar gagal dimuat
    const handleImageError = (e) => {
        e.target.onerror = null; // Mencegah loop error jika placeholder juga gagal
        e.target.src = placeholderImage;
    };

    return (
        <div className="column is-one-third">
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="card-image">
                    <figure className="image is-4by3">
                        <img 
                            src={article.thumbnail_url || placeholderImage} 
                            alt={article.title} 
                            onError={handleImageError}
                            style={{ objectFit: 'cover' }}
                        />
                    </figure>
                </div>
                <div className="card-content" style={{ flexGrow: 1 }}>
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-5">{article.title}</p>
                            <p className="subtitle is-7">
                                Oleh {article.author?.username || 'N/A'} - {new Date(article.published_at || article.createdAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                    <div className="content is-small">
                        {/* Memotong konten agar tidak terlalu panjang */}
                        {article.content.substring(0, 100)}...
                    </div>
                </div>
                <footer className="card-footer">
                    <Link to={`/newsdetail/${article.id_article}`} className="card-footer-item">
                        Baca Selengkapnya
                    </Link>
                </footer>
            </div>
        </div>
    );
};

export default NewsCard;