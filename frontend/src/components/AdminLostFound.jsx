import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLostFound.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://192.168.31.197:5000";

const ENDPOINT =
  `${API_BASE_URL}/api/lostfound`;

const AdminLostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH ITEMS
  // ==========================================

  const fetchItems = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (user.role !== "admin") {
        window.location.href = "/";
        return;
      }

      const response = await axios.get(
        ENDPOINT
      );

      setItems(response.data || []);

    } catch (error) {
      console.error(
        "Fetch Lost Found Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (id) => {
    try {
      setUpdatingId(id);

      const response = await axios.put(
        `${ENDPOINT}/${id}/status`,
        {},
        {
          headers: {
            "x-user-role": "admin",
          },
        }
      );

      if (response.data.success) {
        await fetchItems();
      }

    } catch (error) {
      console.error(
        "Update Status Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update status"
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // DELETE ITEM
  // ==========================================

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${ENDPOINT}/${id}`,
        {
          headers: {
            "x-user-role": "admin",
          },
        }
      );

      if (response.data.success) {
        setItems((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );
      }

    } catch (error) {
      console.error(
        "Delete Item Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete item"
      );
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Open") return "open";
    if (status === "Claimed") return "claimed";

    return "default-status";
  };

  return (
    <div className="admin-lost-found-page">

      {/* HEADER */}

      <header className="lost-found-topbar">

        <div className="lost-found-brand">

          <div className="lost-found-brand-icon">
            🎓
          </div>

          <div>
            <h1>CampusConnect AI</h1>
            <p>
              Lost & Found Administration
            </p>
          </div>

        </div>

        <button
          className="lost-dashboard-btn"
          onClick={() =>
            (window.location.href = "/admin")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN */}

      <main className="admin-lost-found-main">

        {/* INTRO */}

        <section className="lost-found-intro">

          <div>

            <p className="lost-page-label">
              ADMIN PANEL
            </p>

            <h2>
              Lost & Found Management
            </h2>

            <p>
              Review and manage items reported
              by students.
            </p>

          </div>

          <div className="lost-item-count">

            <span>
              Total Items
            </span>

            <strong>
              {items.length}
            </strong>

          </div>

        </section>

        {/* LOADING */}

        {loading && (
          <div className="lost-loading">

            <div className="lost-spinner"></div>

            <p>
              Loading Lost & Found items...
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          items.length === 0 && (

            <div className="lost-empty">

              <div className="lost-empty-icon">
                📭
              </div>

              <h3>
                No Lost & Found Items
              </h3>

              <p>
                There are currently no reported
                items to display.
              </p>

            </div>
          )}

        {/* GRID */}

        {!loading &&
          items.length > 0 && (

            <section className="admin-lost-grid">

              {items.map((item) => (

                <article
                  className="admin-lost-card"
                  key={item._id}
                >

                  {/* IMAGE */}

                  <div className="lost-image-wrapper">

                    {item.image ? (

                      <img
                        src={`${API_BASE_URL}${item.image}`}
                        alt={item.title}
                        className="lost-item-image"
                      />

                    ) : (

                      <div className="no-image">

                        <span>🔎</span>

                        <p>
                          No Image
                        </p>

                      </div>
                    )}

                    <span
                      className={`lost-type-badge ${
                        item.type === "Lost"
                          ? "lost"
                          : "found"
                      }`}
                    >
                      {item.type}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="lost-card-content">

                    {/* TITLE */}

                    <div className="lost-card-title">

                      <div>

                        <h3>
                          {item.title}
                        </h3>

                        <span>
                          ID:{" "}
                          {item._id?.slice(-6)}
                        </span>

                      </div>

                      <span
                        className={`lost-status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </div>

                    {/* STUDENT INFORMATION */}

                    <div className="lost-student-box">

                      <div className="lost-box-heading">

                        <span>
                          👨‍🎓
                        </span>

                        Student Information

                      </div>

                      <div className="lost-student-grid">

                        <div>

                          <span>
                            Name
                          </span>

                          <strong>
                            {item.studentName}
                          </strong>

                        </div>

                        <div>

                          <span>
                            ERP ID
                          </span>

                          <strong>
                            {item.erpId}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Course
                          </span>

                          <strong>
                            {item.course}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Phone
                          </span>

                          <strong>
                            {item.phone}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* ITEM DETAILS */}

                    <div className="lost-details">

                      <div className="lost-box-heading">

                        <span>
                          📋
                        </span>

                        Item Details

                      </div>

                      <div className="lost-detail-row">

                        <span>
                          Location
                        </span>

                        <strong>
                          {item.location}
                        </strong>

                      </div>

                      <div className="lost-description">

                        <span>
                          Description
                        </span>

                        <p>
                          {item.description}
                        </p>

                      </div>

                      <div className="lost-submitted">

                        <span>
                          Submitted
                        </span>

                        <strong>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleString()
                            : "N/A"}
                        </strong>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="lost-actions">

                      <button
                        className="lost-status-btn"
                        onClick={() =>
                          updateStatus(
                            item._id
                          )
                        }
                        disabled={
                          updatingId ===
                          item._id
                        }
                      >

                        {updatingId ===
                        item._id
                          ? "Updating..."
                          : item.status === "Open"
                          ? "Mark Claimed"
                          : "Mark Open"}

                      </button>

                      <button
                        className="lost-delete-btn"
                        onClick={() =>
                          deleteItem(
                            item._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </section>
          )}

      </main>

      {/* FOOTER */}

      <footer className="lost-found-footer">

        <span>
          CampusConnect AI
        </span>

        <span>
          •
        </span>

        <span>
          Smart Campus Management System
        </span>

      </footer>

    </div>
  );
};

export default AdminLostFound;