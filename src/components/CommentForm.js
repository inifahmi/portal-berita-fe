// src/components/CommentForm.js

import React, { useState } from 'react';
import api from '../api/axios';

const CommentForm = ({ articleId, parentCommentId = null, onCommentPosted }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Komentar tidak boleh kosong.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Ambil token dari local storage
            await api.post('/comments', {
                article_id: articleId,
                content,
                parent_comment_id: parentCommentId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setContent(''); // Kosongkan form
            setError('');
            if (onCommentPosted) {
                onCommentPosted(); // Panggil callback untuk refresh list komentar
            }
        } catch (err) {
            setError('Gagal mengirim komentar. Pastikan Anda sudah login.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="field">
                <div className="control">
                    <textarea
                        className="textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={parentCommentId ? "Tulis balasan Anda..." : "Tulis komentar Anda..."}
                        rows="3"
                    ></textarea>
                </div>
            </div>
            {error && <p className="help is-danger">{error}</p>}
            <div className="field">
                <div className="control">
                    <button type="submit" className="button is-primary">
                        Kirim
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;