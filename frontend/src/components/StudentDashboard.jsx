import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="student-dashboard">

      {/* Header */}
      <header className="student-header">

        <div className="student-brand">
          <div className="student-brand-icon">
            🎓
          </div>

          <div>
            <h1>CampusConnect AI</h1>
            <p>Smart Campus Management System</p>
          </div>
        </div>

        <div className="student-header-right">

          <div className="student-profile">
            <div className="student-avatar">
              {(user?.name || "S").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name || "Student"}</strong>
              <span>{user?.erpId || "N/A"}</span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* Main */}
      <main className="student-main">

        {/* Welcome */}
        <section className="welcome-section">

          <div className="welcome-content">

            <p className="welcome-small">
              STUDENT PORTAL
            </p>

            <h2>
              Welcome back,{" "}
              {user?.name || "Student"} 👋
            </h2>

            <p>
              Manage your campus services from one place.
            </p>

          </div>

          <div className="welcome-info">

            <span>ERP ID</span>

            <strong>
              {user?.erpId || "N/A"}
            </strong>

          </div>

        </section>

        {/* Services */}
        <section className="services-section">

          <div className="section-heading">

            <div>
              <p className="section-label">
                CAMPUS SERVICES
              </p>

              <h2>
                What would you like to do?
              </h2>

              <p>
                Access your campus services quickly and easily.
              </p>
            </div>

          </div>

          <div className="service-grid">

            {/* Complaints */}
            <div className="service-card">

              <div className="service-card-top">

                <div className="service-icon complaint-icon">
                  📢
                </div>

                <span className="service-number">
                  01
                </span>

              </div>

              <div className="service-content">

                <h3>
                  Complaints
                </h3>

                <p>
                  Raise a complaint and track its current
                  status from your student portal.
                </p>

                <button
                  onClick={() =>
                    navigate("/complaints")
                  }
                  className="service-btn"
                >
                  Open Complaints
                  <span>→</span>
                </button>

              </div>

            </div>

            {/* Lost & Found */}
            <div className="service-card">

              <div className="service-card-top">

                <div className="service-icon lost-icon">
                  🔎
                </div>

                <span className="service-number">
                  02
                </span>

              </div>

              <div className="service-content">

                <h3>
                  Lost & Found
                </h3>

                <p>
                  Report lost items or check items found
                  around the campus.
                </p>

                <button
                  onClick={() =>
                    navigate("/lostfound")
                  }
                  className="service-btn"
                >
                  Open Lost & Found
                  <span>→</span>
                </button>

              </div>

            </div>

            {/* AI Assistant */}
            <div className="service-card">

              <div className="service-card-top">

                <div className="service-icon ai-icon">
                  🤖
                </div>

                <span className="service-number">
                  03
                </span>

              </div>

              <div className="service-content">

                <h3>
                  AI Assistant
                </h3>

                <p>
                  Ask CampusBot about campus information,
                  services and common queries.
                </p>

                <button
                  onClick={() =>
                    navigate("/ai")
                  }
                  className="service-btn"
                >
                  Open AI Assistant
                  <span>→</span>
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="student-footer">

        <div>
          <strong>
            CampusConnect AI
          </strong>

          <span>•</span>

          <span>
            Smart Campus Management System
          </span>
        </div>

        <span>
          Student Portal
        </span>

      </footer>

    </div>
  );
};

export default StudentDashboard;