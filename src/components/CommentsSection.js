// src/components/CommentsSection.js

import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Comment from './Comment.js'; // Komponen baru untuk menampilkan 1 komentar
import CommentForm from './CommentForm.js'; // Asumsi Anda punya form untuk menambah komentar

const CommentsSection = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            setLoading(true);
            // Panggil API yang mengembalikan komentar berjenjang
            const response = await api.get(`/articles/${articleId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error("Gagal memuat komentar:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    // Fungsi ini akan dipanggil dari form setelah berhasil mengirim komentar
    const handleCommentPosted = () => {
        // Muat ulang komentar untuk menampilkan yang baru
        fetchComments();
    };

    if (loading) return <div>Memuat komentar...</div>;

    return (
        <div className="mt-5">
            <h2 className="title is-4">Komentar ({comments.length})</h2>
            
            {/* Form untuk menambah komentar utama */}
            <CommentForm articleId={articleId} onCommentPosted={handleCommentPosted} />
            
            <hr />

            {/* Render semua komentar utama */}
            {comments.length > 0 ? (
                comments.map(comment => (
                    <Comment 
                        key={comment.id_comment} 
                        comment={comment} 
                        articleId={articleId}
                        onReplySuccess={handleCommentPosted}
                    />
                ))
            ) : (
                <p>Belum ada komentar.</p>
            )}
        </div>
    );
};

export default CommentsSection;