import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";     // <-- Import Komponen Baru
import Footer from "../components/Footer"; // <-- Import Komponen Baru
import api, { BASE_URL } from '../services/api';

export default function Home() {
  // Menampung SELURUH produk dari database tanpa batasan page
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State untuk pagination murni di sisi Frontend
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Jumlah produk per halaman yang ingin ditampilkan
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAllProducts(), fetchCategories()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      let productsAccumulator = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const res = await api.get(`/products?page=${page}`);
        const pageData = res.data.data || [];
        productsAccumulator = [...productsAccumulator, ...pageData];

        const current = res.data.pagination?.current_page || page;
        const last = res.data.pagination?.last_page || page;

        if (current < last) {
          page++;
        } else {
          hasNextPage = false; 
        }
      }
      setAllProducts(productsAccumulator);
    } catch (error) {
      console.error("Gagal mendownload seluruh produk:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      let allCategories = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const res = await api.get(`/categories?page=${page}`);
        const pageData = res.data.data || [];
        allCategories = [...allCategories, ...pageData];

        const current = res.data.pagination?.current_page || page;
        const last = res.data.pagination?.last_page || page;

        if (current < last) {
          page++;
        } else {
          hasNextPage = false;
        }
      }
      setCategories(allCategories);
    } catch (error) {
      console.error("Gagal load kategori:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1); 
  };

  // ==================== LOGIKA UTAMA FRONTEND FILTER & PAGINATION ====================
  const filteredProducts = selectedCategory === "All"
    ? allProducts
    : allProducts.filter(item => item.category?.nama_kategori === selectedCategory);

  const lastPage = Math.ceil(filteredProducts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisplayedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* 1. TAMPILKAN HERO COMPONENT */}
      <Hero />

      {/* 2. DASHBOARD DISPLAY CATALOG (Diberi ID untuk scroll anchor) */}
      <div id="catalog-section" className="container-fluid py-5" style={{ backgroundColor: "#FFF8F8", flex: "1" }}>
        <div className="container">
          
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Product Catalog Display</h2>
            <div style={{ width: "60px", height: "4px", backgroundColor: "#D8A7B1", margin: "10px auto", borderRadius: "2px" }}></div>
          </div>

          {/* Tombol Kategori Navigasi */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            <button
              className="btn px-4 py-2 shadow-sm fw-semibold"
              style={{
                borderRadius: "30px",
                backgroundColor: selectedCategory === "All" ? "#D8A7B1" : "#FFFFFF",
                color: selectedCategory === "All" ? "#FFFFFF" : "#666666",
                border: "none",
                fontSize: "14px"
              }}
              onClick={() => handleCategoryClick("All")}
            >
              ✨ Semua Produk
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className="btn px-4 py-2 shadow-sm fw-semibold"
                style={{
                  borderRadius: "30px",
                  backgroundColor: selectedCategory === cat.nama_kategori ? "#D8A7B1" : "#FFFFFF",
                  color: selectedCategory === cat.nama_kategori ? "#FFFFFF" : "#666666",
                  border: "none",
                  fontSize: "14px"
                }}
                onClick={() => handleCategoryClick(cat.nama_kategori)}
              >
                {cat.nama_kategori}
              </button>
            ))}
          </div>

          {/* Grid Tampilan */}
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: "#D8A7B1" }} /></div>
          ) : (
            <>
              <div className="row g-3">
                {currentDisplayedProducts.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="card border-0 p-5 shadow-sm rounded-4 bg-white">
                      <i className="bi bi-basket text-muted" style={{ fontSize: "3rem" }}></i>
                      <p className="text-muted mt-3 mb-0">Tidak ada produk dalam kategori "{selectedCategory}".</p>
                    </div>
                  </div>
                ) : (
                  currentDisplayedProducts.map((item) => (
                    <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm position-relative overflow-hidden" style={{ borderRadius: "18px" }}>
                        <span className="badge position-absolute top-0 start-0 m-2 px-2.5 py-1.5 border-0 shadow-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", color: "#666", borderRadius: "8px", zIndex: 2, fontSize: "11px" }}>
                          {item.category?.nama_kategori || "Skincare"}
                        </span>

                        <div style={{ height: "180px", overflow: "hidden", backgroundColor: "#fff" }} className="d-flex align-items-center justify-content-center p-2">
                          <img
                            src={`${BASE_URL}/images/products/${item.gambar}`}
                            alt={item.nama_produk}
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                            onError={(e) => { e.target.src = "https://placehold.co/300x180?text=No+Image"; }}
                          />
                        </div>

                        <div className="card-body p-3 d-flex flex-column bg-white">
                          <small className="text-muted text-uppercase fw-bold mb-0" style={{ fontSize: "10px" }}>{item.brand}</small>
                          <h6 className="card-title fw-bold text-dark mb-2 text-truncate" title={item.nama_produk} style={{ fontSize: "14px" }}>{item.nama_produk}</h6>
                          
                          <div className="d-flex justify-content-between align-items-end mt-auto">
                            <div>
                              <span className="text-muted d-block small" style={{ fontSize: "10px" }}>Harga</span>
                              <span className="fw-bold text-dark small" style={{ fontSize: "14px" }}>Rp {Number(item.harga).toLocaleString("id-ID")}</span>
                            </div>
                            <div className="text-end">
                              <span className="text-muted d-block small" style={{ fontSize: "10px" }}>Stok</span>
                              <span className="fw-bold small text-muted" style={{ fontSize: "13px" }}>{item.stok} pcs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Frontend */}
              {lastPage > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link border-0 shadow-sm mx-1 rounded-circle" onClick={() => setCurrentPage(currentPage - 1)} style={{ color: "#D8A7B1" }}>
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(lastPage)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                          <button
                            className="page-link border-0 shadow-sm mx-1 rounded-circle"
                            style={{
                              backgroundColor: currentPage === index + 1 ? "#D8A7B1" : "white",
                              color: currentPage === index + 1 ? "white" : "#666"
                            }}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                        <button className="page-link border-0 shadow-sm mx-1 rounded-circle" onClick={() => setCurrentPage(currentPage + 1)} style={{ color: "#D8A7B1" }}>
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3. TAMPILKAN FOOTER COMPONENT */}
      <Footer />
    </div>
  );
}