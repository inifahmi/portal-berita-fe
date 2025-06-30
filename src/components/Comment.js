// src/components/Comment.js

import React, { useState } from 'react';
import CommentForm from './CommentForm'; // Menggunakan kembali form yang sama

const Comment = ({ comment, articleId, onReplySuccess }) => {
    const [isReplying, setIsReplying] = useState(false);

    // Format tanggal agar lebih mudah dibaca
    const formattedDate = new Date(comment.createdAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleReplyPosted = () => {
        setIsReplying(false); // Tutup form setelah berhasil membalas
        onReplySuccess();     // Panggil fungsi dari parent untuk refresh
    }

    return (
        <article className="media" style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="media-content">
                <div className="content">
                    <p>
                        <strong>{comment.user ? comment.user.username : 'Anonim'}</strong>
                        <br />
                        {comment.content}
                        <br />
                        <small>{formattedDate} · <a onClick={() => setIsReplying(!isReplying)}>Balas</a></small>
                    </p>
                </div>

                {/* Tampilkan form balasan jika state isReplying true */}
                {isReplying && (
                    <CommentForm 
                        articleId={articleId} 
                        parentCommentId={comment.id_comment} // <-- Kirim ID parent
                        onCommentPosted={handleReplyPosted}
                        initialContent="" // Kosongkan, karena ini balasan baru
                    />
                )}

                {/* ====== BAGIAN REKURSIF ====== */}
                {/* Jika ada balasan (replies), panggil kembali komponen Comment ini untuk setiap balasan */}
                {comment.replies && comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px', borderLeft: '2px solid #dbdbdb', paddingLeft: '20px' }}>
                        {comment.replies.map(reply => (
                            <Comment 
                                key={reply.id_comment} 
                                comment={reply} 
                                articleId={articleId}
                                onReplySuccess={onReplySuccess}
                            />
                        ))}
                    </div>
                )}
                {/* ====== AKHIR BAGIAN REKURSIF ====== */}
                
            </div>
        </article>
    );
};

export default Comment;