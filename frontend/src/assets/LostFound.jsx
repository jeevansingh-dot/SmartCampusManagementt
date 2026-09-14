import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ENDPOINT = `${API_BASE_URL}/api/lostfound`;

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchItems = async () => {
    try {
      const res = await axios.get(ENDPOINT);
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("type", type);
    formData.append("location", location.trim());
    formData.append("contact", contact.trim());
    formData.append("description", description.trim());
    
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(ENDPOINT, formData);

      setTitle("");
      setLocation("");
      setContact("");
      setDescription("");
      setImage(null);
      
      // Reset input field
      e.target.reset();
      
      fetchItems();
      alert("Item reported successfully! 🔍");
    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit report");
    }
  };

  const toggleStatus = async (item) => {
    const id = item._id || item.id;
    if (!id) return alert("Missing ID!");

    try {
      await axios.put(`${ENDPOINT}/${id}/status`);
      fetchItems();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;
    if (!id || !window.confirm("Delete this item?")) return;

    try {
      await axios.delete(`${ENDPOINT}/${id}`);
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "Recently";
    const dateObj = new Date(isoString);
    return `${dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} at ${dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const lostCount = items.filter((i) => i.type === "Lost" && i.status !== "Claimed").length;
  const foundCount = items.filter((i) => i.type === "Found" && i.status !== "Claimed").length;
  const claimedCount = items.filter((i) => i.status === "Claimed").length;

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "Claimed") return item.status === "Claimed";
    return item.type === filter && item.status !== "Claimed";
  });

  return (
    <div style={{ maxWidth: "650px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#1d3557", marginBottom: "20px" }}>Lost & Found Portal 🔍</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ margin: "0 0 5px 0" }}>Report an Item</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontWeight: "bold" }}
          >
            <option value="Lost">🔴 Lost Item</option>
            <option value="Found">🟢 Found Item</option>
          </select>

          <input
            type="text"
            placeholder="Item Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>

        <input
          type="text"
          placeholder="Location *"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Contact Info *"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <textarea
          placeholder="Additional Details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>
            Upload Item Photo (Optional):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ padding: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: type === "Lost" ? "#e63946" : "#2a9d8f",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Post {type} Item Report 📢
        </button>
      </form>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { label: "ALL", count: items.length },
          { label: "Lost", count: lostCount },
          { label: "Found", count: foundCount },
          { label: "Claimed", count: claimedCount },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setFilter(tab.label)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "13px",
              backgroundColor: filter === tab.label ? "#1d3557" : "#e0e0e0",
              color: filter === tab.label ? "#fff" : "#333",
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* ITEM LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {filteredItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No items found in this category.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id || item.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#fff",
                borderLeft: `6px solid ${
                  item.status === "Claimed"
                    ? "#6c757d"
                    : item.type === "Lost"
                    ? "#e63946"
                    : "#2a9d8f"
                }`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: "17px", color: "#1d3557" }}>
                  {item.title}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: item.status === "Claimed" ? "#e2e3e5" : item.type === "Lost" ? "#ffe5e5" : "#e5ffe5",
                    color: item.status === "Claimed" ? "#383d41" : item.type === "Lost" ? "#d90429" : "#2a9d8f",
                  }}
                >
                  {item.status === "Claimed" ? "Claimed / Resolved" : item.type}
                </span>
              </div>

              {item.image && (
                <img
                  src={`${API_BASE_URL}${item.image}`}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxHeight: "280px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "5px",
                  }}
                />
              )}

              <div style={{ fontSize: "13px", color: "#444" }}>
                📍 <strong>Location:</strong> {item.location} | 📞 <strong>Contact:</strong> {item.contact}
              </div>

              <div style={{ fontSize: "12px", color: "#666" }}>
                🕒 <strong>Reported on:</strong> {formatDateTime(item.createdAt)}
              </div>

              <p style={{ margin: "6px 0", color: "#333", whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                {item.description}
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={() => toggleStatus(item)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: item.status === "Open" ? "#2a9d8f" : "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {item.status === "Open" ? "Mark as Claimed ✔️" : "Mark as Active ⏳"}
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#e63946",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LostFound;