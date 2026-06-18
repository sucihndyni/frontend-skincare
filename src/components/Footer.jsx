export default function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container text-center">
        <p className="text-muted small mb-1">
          &copy; 2026 <span className="fw-semibold" style={{ color: "#D8A7B1" }}>SweetGlow App</span>. All Rights Reserved.
        </p>
        <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
          Developed with <i className="bi bi-heart-fill text-danger"></i> for Premium Skincare Distribution Management.
        </p>
      </div>
    </footer>
  );
}