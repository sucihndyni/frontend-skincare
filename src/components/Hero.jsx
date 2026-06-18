export default function Hero() {
  return (
    <div 
      className="container-fluid d-flex align-items-center position-relative overflow-hidden" 
      style={{ height: "85vh", background: "linear-gradient(135deg, #FFF9F9 0%, #FFEBEF 100%)", paddingLeft: "8%" }}
    >
      <div className="row w-100 align-items-center" style={{ zIndex: 2 }}>
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3" style={{ color: "#D8A7B1", fontSize: "3.5rem", lineHeight: "1.2" }}>
            Welcome to <br /> SweetGlow
          </h1>
          <h3 className="fw-semibold mb-4 text-secondary" style={{ fontSize: "1.5rem" }}>
            Premium Skincare for Healthy & Glowing Skin
          </h3>
          <p className="text-muted mb-4" style={{ maxWidth: "500px", fontSize: "15px", lineHeight: "1.6" }}>
            Discover our carefully curated collection of premium skincare products designed to enhance your natural beauty and give you that coveted glow.
          </p>
          <a 
            href="#catalog-section" 
            className="btn text-white px-4 py-2 fw-semibold rounded-pill shadow-sm" 
            style={{ backgroundColor: "#D8A7B1", border: "none", fontSize: "14px" }}
          >
            Explore Products <i className="bi bi-arrow-down ms-2"></i>
          </a>
        </div>
      </div>

      {/* Ornamen Gradasi Lingkaran Merah Muda Estetis di Sisi Kanan */}
      <div 
        className="position-absolute end-0 top-50 translate-middle-y d-none d-lg-block"
        style={{
          width: "600px",
          height: "600px",
          marginRight: "5%",
          pointerEvents: "none",
          zIndex: 1
        }}
      >
        {/* Lingkaran 1: Pink Pastel Vibrant */}
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(233, 149, 177, 0.45) 0%, rgba(255, 240, 243, 0) 70%)",
            top: "0",
            left: "0",
            filter: "blur(20px)"
          }}
        />
        {/* Lingkaran 2: Peach Pastel Lembut */}
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(246, 215, 218, 0.6) 0%, rgba(255, 255, 255, 0) 75%)",
            bottom: "50px",
            right: "50px",
            filter: "blur(10px)"
          }}
        />
        {/* Lingkaran 3: Rose Gold Accent */}
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, rgba(216, 167, 177, 0.5) 0%, rgba(255, 248, 248, 0) 70%)",
            top: "120px",
            left: "120px"
          }}
        />
      </div>
    </div>
  );
}