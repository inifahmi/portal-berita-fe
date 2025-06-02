// src/components/CreateArticle.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState("draft"); // Default status
  const [categories, setCategories] = useState([]); // Daftar kategori dari API
  const [selectedCategories, setSelectedCategories] = useState([]); // Kategori yang dipilih untuk artikel
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Ambil daftar kategori dari API saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (err) {
        console.error("Gagal mengambil kategori:", err);
        setError("Gagal memuat daftar kategori.");
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id_user) {
        setError("Anda harus login untuk membuat artikel.");
        return;
      }

      const articleData = {
        title,
        content,
        thumbnail_url: thumbnailUrl,
        author_id: user.id_user,
        status,
        category_ids: selectedCategories // Kirim array ID kategori yang dipilih
      };

      // Pastikan ada token autentikasi
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Ganti URL dengan endpoint API Anda untuk membuat artikel baru
      const response = await axios.post("http://localhost:5000/api/articles", articleData, config);

      setSuccess("Artikel berhasil dibuat!");
      // Reset form atau arahkan ke halaman detail artikel baru
      setTimeout(() => {
        navigate(`/newsdetail/${response.data.id_article}`); // Asumsi backend mengembalikan id_article yang baru dibuat
      }, 1500);

    } catch (err) {
      console.error("Gagal membuat artikel:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Gagal membuat artikel. Pastikan semua kolom terisi dengan benar.");
    }
  };

  const handleCategoryChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCategories(value);
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <div className="box">
                <h1 className="title has-text-centered is-4">Buat Artikel Baru</h1>
                <p className="has-text-centered is-size-6 has-text-grey mb-4">
                  Isi detail artikel Anda
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Judul Artikel</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Masukkan judul artikel"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Konten Artikel</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Tulis konten artikel di sini..."
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">URL Thumbnail Gambar</label>
                    <div className="control">
                      <input
                        className="input"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Kategori</label>
                    <div className="control">
                      {loadingCategories ? (
                        <p>Memuat kategori...</p>
                      ) : categories.length > 0 ? (
                        <div className="select is-multiple is-fullwidth">
                          <select multiple size="3" value={selectedCategories} onChange={handleCategoryChange}>
                            {categories.map(cat => (
                              <option key={cat.id_category} value={cat.id_category}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="has-text-danger">Tidak ada kategori tersedia. Harap tambahkan kategori terlebih dahulu.</p>
                      )}
                      <p className="help">Pilih satu atau beberapa kategori (tekan Ctrl/Cmd untuk memilih banyak).</p>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Status Artikel</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="draft">Draft</option>
                          <option value="menunggu">Menunggu Review</option>
                          {/* Admin mungkin punya opsi langsung menerbitkan */}
                          {/* <option value="diterbitkan">Terbitkan Langsung</option> */}
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && <p className="help is-danger">{error}</p>}
                  {success && <p className="help is-success">{success}</p>}

                  <div className="field is-grouped is-grouped-centered mt-5">
                    <div className="control">
                      <button type="submit" className="button is-link">
                        Simpan Artikel
                      </button>
                    </div>
                    <div className="control">
                      <button type="button" className="button is-light" onClick={() => navigate(-1)}>
                        Batal
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;