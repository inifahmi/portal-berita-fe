// src/components/LikeButton.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Untuk link ke login

const LikeButton = ({ articleId }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user")); // Pengguna yang sedang login

  useEffect(() => {
    fetchLikeStatus();
  }, [articleId, currentUser?.id_user]); // Refresh jika articleId atau user berubah

  const fetchLikeStatus = async () => {
    try {
      setLoading(true);
      setError("");

      // Ambil jumlah like
      const countResponse = await axios.get(`http://localhost:5000/api/articles/${articleId}/likes/count`);
      setLikeCount(countResponse.data.count);

      // Cek apakah user saat ini sudah like
      if (currentUser && currentUser.id_user) {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Endpoint untuk mengecek apakah user sudah like artikel ini
        const likedStatusResponse = await axios.get(`http://localhost:5000/api/users/${currentUser.id_user}/likes/${articleId}`, config);
        setIsLiked(likedStatusResponse.data.isLiked);
      } else {
        setIsLiked(false);
      }
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil status like:", err.response ? err.response.data : err.message);
      // setError("Gagal memuat status like."); // Mungkin tidak perlu menampilkan error ke user untuk ini
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!currentUser || !currentUser.id_user) {
      setError("Anda harus login untuk memberi like.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isLiked) {
        // Jika sudah like, maka batalkan like
        await axios.delete(`http://localhost:5000/api/likes/${articleId}`, config); // Endpoint DELETE like
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // Jika belum like, maka beri like
        await axios.post("http://localhost:5000/api/likes", {
          article_id: articleId,
          user_id: currentUser.id_user
        }, config); // Endpoint POST like
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Gagal mengubah status like:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal mengubah status like.");
    }
  };

  if (loading) {
    return <p>Memuat like...</p>;
  }

  return (
    <div className="like-button-section">
      <button
        className={`button ${isLiked ? 'is-primary' : 'is-light'}`}
        onClick={handleLikeToggle}
        disabled={!currentUser} // Disable jika tidak login
      >
        <span className="icon">
          <i className={`fas fa-thumbs-up ${isLiked ? '' : ''}`}></i> {/* Icon jempol */}
        </span>
        <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>
      {!currentUser && <p className="help">Silakan <Link to="/login">login</Link> untuk memberi like.</p>}
      {error && <p className="help is-danger">{error}</p>}
    </div>
  );
};

export default LikeButton;