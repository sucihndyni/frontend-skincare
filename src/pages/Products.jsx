import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { BASE_URL } from '../services/api';// Ambil BASE_URL yang sama seperti di Home

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  // State Form Edit Produk Lengkap
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editHarga, setEditHarga] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editKategoriId, setEditKategoriId] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Seluruh Produk dengan Bypass Pagination
      let allProducts = [];
      let pageProd = 1;
      let hasNextPageProd = true;
      while (hasNextPageProd) {
        const resProd = await api.get(`/products?page=${pageProd}`);
        const pageDataProd = resProd.data?.data || [];
        allProducts = [...allProducts, ...pageDataProd];

        const currentProd = resProd.data?.pagination?.current_page || pageProd;
        const lastProd = resProd.data?.pagination?.last_page || pageProd;

        if (currentProd < lastProd) pageProd++;
        else hasNextPageProd = false;
      }
      setProducts(allProducts);

      // 2. Fetch Seluruh Kategori (Bypass Pagination agar muncul semua 10 Kategori)
      let allCategories = [];
      let pageCat = 1;
      let hasNextPageCat = true;
      while (hasNextPageCat) {
        const resCat = await api.get(`/categories?page=${pageCat}`);
        const pageDataCat = resCat.data?.data || [];
        allCategories = [...allCategories, ...pageDataCat];

        const currentCat = resCat.data?.pagination?.current_page || pageCat;
        const lastCat = resCat.data?.pagination?.last_page || pageCat;

        if (currentCat < lastCat) pageCat++;
        else hasNextPageCat = false;
      }
      setCategories(allCategories);

    } catch (error) {
      console.error("Gagal memuat data produk/kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi memicu pengisian form saat tombol edit diklik
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditNama(product.nama_produk || "");
    setEditBrand(product.brand || "");
    setEditHarga(product.harga || "");
    setEditStok(product.stok || "");
    setEditKategoriId(product.category?.id || product.category_id || "");
  };

  // Fungsi Submit Update ke API Laravel
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama_produk: editNama,
        brand: editBrand,
        harga: Number(editHarga),
        stok: Number(editStok),
        category_id: editKategoriId
      };

      const response = await api.put(`/products/${selectedProduct.id}`, payload);
      
      // Pastikan status sukses didapat sebelum memunculkan notifikasi sukses
      if (response.status === 200 || response.status === 204) {
        alert("Produk berhasil diperbarui!"); // <-- NOTIFIKASI BERHASIL EDIT PRODUK
      }

      // Tutup modal secara programmatic melalui selector Bootstrap
      const modalElement = document.getElementById("editProductModal");
      const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
      modalInstance?.hide();

      // Refresh data komponen
      fetchInitialData();
    } catch (error) {
      console.error("Gagal memperbarui data produk:", error);
      alert("Terjadi kesalahan saat menyimpan perubahan.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const response = await api.delete(`/products/${id}`);
        if (response.status === 200 || response.status === 204) {
          alert("Produk berhasil dihapus!");
          fetchInitialData();
        }
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        alert(error.response?.data?.message || "Terjadi kesalahan saat menghapus produk.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4" style={{ backgroundColor: "#FFF8F8", minHeight: "100vh" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: "#D8A7B1" }}>Product Catalog Management</h2>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "#D8A7B1" }} />
            </div>
          ) : (
            <div className="row g-4">
              {products.map((prod) => (
                <div className="col-md-3" key={prod.id}>
                  <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: "15px" }}>
                    
                    <div style={{ height: "150px", overflow: "hidden", backgroundColor: "#fff" }} className="d-flex align-items-center justify-content-center mb-3">
                      <img 
                        src={`${BASE_URL}/images/products/${prod.gambar}`} 
                        alt={prod.nama_produk}
                        className="img-fluid rounded"
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        onError={(e) => { e.target.src = "https://placehold.co/300x180?text=No+Image"; }}
                      />
                    </div>

                    <span className="badge bg-secondary-subtle text-secondary align-self-start mb-2 px-2.5 py-1">
                      {prod.category?.nama_kategori || "Skincare"}
                    </span>
                    <h6 className="fw-bold text-dark mb-1 text-truncate" title={prod.nama_produk}>{prod.nama_produk}</h6>
                    <small className="text-muted mb-2 d-block">{prod.brand}</small>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                      <span className="fw-bold text-danger">Rp {Number(prod.harga).toLocaleString("id-ID")}</span>
                      <small className="text-muted">Stok: <strong>{prod.stok} pcs</strong></small>
                    </div>
                    <div className="row g-2 mt-2">
                      <div className="col-6">
                        <button 
                          className="btn btn-sm btn-outline-primary w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#editProductModal"
                          onClick={() => handleEditClick(prod)}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => handleDeleteProduct(prod.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODAL MASTER FORM UPDATE PRODUK ==================== */}
      <div className="modal fade" id="editProductModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "15px" }}>
            <div className="modal-header border-bottom-0" style={{ background: "#F9F1F2" }}>
              <h5 className="modal-title fw-bold">Update Informasi Produk</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form onSubmit={handleUpdateProduct}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nama Produk</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editNama} 
                    onChange={(e) => setEditNama(e.target.value)} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Merek / Brand</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editBrand} 
                    onChange={(e) => setEditBrand(e.target.value)} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Kategori Produk</label>
                  <select 
                    className="form-select" 
                    value={editKategoriId} 
                    onChange={(e) => setEditKategoriId(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Harga Baru (Rp)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editHarga} 
                      onChange={(e) => setEditHarga(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small fw-bold text-muted">Jumlah Stok</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editStok} 
                      onChange={(e) => setEditStok(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light px-4 border" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn text-white px-4" style={{ backgroundColor: "#D8A7B1" }}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}