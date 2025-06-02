// src/components/CommentsSection.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { formatDistanceToNow } from "date-fns"; // Untuk format waktu, perlu install date-fns
import { id } from "date-fns/locale"; // Untuk lokalisasi bahasa Indonesia

const CommentItem = ({ comment, onReply, currentUser }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setReplyError("");

    if (!replyContent.trim()) {
      setReplyError("Isi balasan tidak boleh kosong.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setReplyError("Anda harus login untuk membalas komentar.");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const newReply = {
        article_id: comment.article_id,
        user_id: currentUser.id_user,
        content: replyContent,
        parent_comment_id: comment.id_comment,
      };

      await axios.post("http://localhost:5000/api/comments", newReply, config); // Endpoint POST komentar

      setReplyContent("");
      setShowReplyForm(false);
      if (onReply) {
        onReply(); // Beri tahu parent untuk me-refresh komentar
      }
    } catch (err) {
      console.error("Gagal mengirim balasan:", err.response ? err.response.data : err.message);
      setReplyError(err.response?.data?.message || "Gagal mengirim balasan.");
    }
  };

  return (
    <div className="box mb-3" style={{ padding: '15px' }}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{comment.user_username || `Pengguna ID ${comment.user_id}`}</strong>{" "}
              <small>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}</small>
              <br />
              {comment.content}
            </p>
          </div>
          {currentUser && ( // Hanya tampilkan tombol balas jika user login
            <nav className="level is-mobile">
              <div className="level-left">
                <a className="level-item" onClick={() => setShowReplyForm(!showReplyForm)}>
                  <span className="icon is-small"><i className="fas fa-reply"></i></span>
                  <span>Balas</span>
                </a>
              </div>
            </nav>
          )}

          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea is-small"
                    placeholder="Tulis balasan Anda..."
                    rows="2"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              {replyError && <p className="help is-danger">{replyError}</p>}
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button type="submit" className="button is-link is-small">Kirim Balasan</button>
                </div>
                <div className="control">
                  <button type="button" className="button is-light is-small" onClick={() => setShowReplyForm(false)}>Batal</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </article>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-5 mt-3"> {/* Margin kiri untuk balasan bersarang */}
          {comment.replies.map(reply => (
            <CommentItem key={reply.id_comment} comment={reply} onReply={onReply} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user")); // Pengguna yang sedang login

  useEffect(() => {
    fetchComments();
  }, [articleId]); // Refresh komentar jika articleId berubah

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");
      // Ganti URL dengan endpoint API Anda untuk mengambil komentar berdasarkan article_id
      const response = await axios.get(`http://localhost:5000/api/articles/${articleId}/comments`);
      setComments(buildCommentTree(response.data)); // Bangun pohon komentar
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil komentar:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal memuat komentar.");
      setLoading(false);
    }
  };

  // Fungsi untuk membangun struktur komentar bersarang (pohon komentar)
  const buildCommentTree = (flatComments) => {
    const commentsMap = new Map();
    const rootComments = [];

    flatComments.forEach(comment => {
      commentsMap.set(comment.id_comment, { ...comment, replies: [] });
    });

    flatComments.forEach(comment => {
      if (comment.parent_comment_id && commentsMap.has(comment.parent_comment_id)) {
        commentsMap.get(comment.parent_comment_id).replies.push(commentsMap.get(comment.id_comment));
      } else {
        rootComments.push(commentsMap.get(comment.id_comment));
      }
    });

    // Urutkan komentar root dan balasannya berdasarkan waktu terbaru
    const sortComments = (commentList) => {
        return commentList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(comment => {
            if (comment.replies.length > 0) {
                comment.replies = sortComments(comment.replies);
            }
            return comment;
        });
    };

    return sortComments(rootComments);
  };


  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCommentContent.trim()) {
      setError("Isi komentar tidak boleh kosong.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Anda harus login untuk berkomentar.");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const newComment = {
        article_id: articleId,
        user_id: currentUser.id_user,
        content: newCommentContent,
        parent_comment_id: null, // Komentar root
      };

      await axios.post("http://localhost:5000/api/comments", newComment, config); // Endpoint POST komentar

      setNewCommentContent("");
      fetchComments(); // Refresh daftar komentar setelah berhasil
    } catch (err) {
      console.error("Gagal mengirim komentar:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal mengirim komentar.");
    }
  };

  if (loading) {
    return <p className="has-text-centered">Memuat komentar...</p>;
  }

  if (error) {
    return <p className="has-text-danger has-text-centered">{error}</p>;
  }

  return (
    <div className="comments-section mt-5">
      <h3 className="title is-5">Komentar ({comments.length})</h3>

      {/* Form untuk Komentar Baru */}
      {currentUser ? ( // Tampilkan form jika user login
        <form onSubmit={handleNewCommentSubmit} className="box mb-4">
          <div className="field">
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Tulis komentar Anda di sini..."
                rows="3"
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          {error && <p className="help is-danger">{error}</p>}
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button type="submit" className="button is-link">Kirim Komentar</button>
            </div>
          </div>
        </form>
      ) : (
        <p className="has-text-centered mb-4">Silakan <Link to="/login">login</Link> untuk berkomentar.</p>
      )}

      {/* Daftar Komentar */}
      {comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id_comment} comment={comment} onReply={fetchComments} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p className="has-text-centered">Belum ada komentar. Jadilah yang pertama!</p>
      )}
    </div>
  );
};

export default CommentsSection;