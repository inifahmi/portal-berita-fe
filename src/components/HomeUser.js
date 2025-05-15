import React from "react";
import Navbar from "./Navbar";

// Dummy data berita
const beritaUtama = {
  id: 1,
  title: "Judul Berita Utama",
  image: "https://via.placeholder.com/600x400",
  description: "Deskripsi singkat mengenai berita...",
};

const beritaKecil = [
  {
    id: 2,
    title: "Judul Berita",
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 3,
    title: "Judul Berita",
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 4,
    title: "Judul Berita",
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 5,
    title: "Judul Berita",
    image: "https://via.placeholder.com/150x150",
  },
];

const beritaLain = [
  {
    id: 6,
    title: "Judul Berita",
    image: "https://via.placeholder.com/300x200",
    description: "Deskripsi Berita yang berkaitan dengan...",
  },
  {
    id: 7,
    title: "Judul Berita",
    image: "https://via.placeholder.com/300x200",
    description: "Deskripsi Berita yang berkaitan dengan...",
  },
  {
    id: 8,
    title: "Judul Berita",
    image: "https://via.placeholder.com/300x200",
    description: "Deskripsi Berita yang berkaitan dengan...",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container is-max-desktop px-2 py-4">
        {/* Main News Section */}
        <div className="box has-background-light mb-5 p-4">
          <div className="columns">
            {/* Berita Utama Besar */}
            <div className="column is-8">
              <div className="box p-0 mb-2" style={{ overflow: "hidden" }}>
                <img
                  src={beritaUtama.image}
                  alt={beritaUtama.title}
                  style={{ width: "100%" }}
                />
              </div>
              <h3 className="title is-5 mb-1">{beritaUtama.title}</h3>
              <p className="is-size-6 has-text-grey">{beritaUtama.description}</p>
            </div>

            {/* Berita Kecil Vertikal */}
            <div className="column">
              {beritaKecil.map((item) => (
                <div key={item.id} className="box mb-2 p-2">
                  <div className="columns is-mobile is-vcentered is-gapless">
                    <div className="column is-4">
                      <div className="image">
                        <img
                          src={item.image}
                          alt={item.title}
                        />
                      </div>
                    </div>
                    <div className="column">
                      <p className="is-size-7 px-2">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Berita Lain Section */}
        <div>
          <h3 className="title is-5 mb-4 pb-2" style={{ borderBottom: "1px solid #dbdbdb" }}>Berita Lain</h3>
          
          <div className="columns is-multiline">
            {beritaLain.map((item) => (
              <div className="column is-4" key={item.id}>
                <div className="box p-0 mb-2" style={{ overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%" }}
                  />
                </div>
                <h3 className="title is-6 mb-1">{item.title}</h3>
                <p className="is-size-7 has-text-grey">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}