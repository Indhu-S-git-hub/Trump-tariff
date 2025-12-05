// src/pages/AgreementsManagementPage.jsx
import React, { useEffect, useState } from "react";
import "./AgreementsManagementPage.css";

const EMPTY_FORM = {
  AgreementCode: "",
  AgreementName: "",
  CountriesIncluded: "",
  ValidityPeriod: "",
  Status: "In force",
};

const AgreementsManagementPage = () => {
  const [agreements, setAgreements] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // ------- LOAD LIST FROM BACKEND -------
  const loadAgreements = () => {
    fetch("http://localhost:5000/api/agreements")
      .then((res) => res.json())
      .then((data) => setAgreements(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("List error", err);
        setAgreements([]);
      });
  };

  useEffect(() => {
    loadAgreements();
  }, []);

  // ------- FILTERING -------
  const filtered = agreements.filter((a) => {
    const status = a.Status || "";
    const code = a.AgreementCode || "";
    const name = a.AgreementName || "";
    const countries = a.CountriesIncluded || "";

    const matchesStatus =
      statusFilter === "All Status" || status === statusFilter;

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      code.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      countries.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // ------- FORM HANDLING -------
  const openAddForm = () => {
    setIsEdit(false);
    setEditingCode(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (a) => {
    setIsEdit(true);
    setEditingCode(a.AgreementCode);
    setForm({
      AgreementCode: a.AgreementCode || "",
      AgreementName: a.AgreementName || "",
      CountriesIncluded: a.CountriesIncluded || "",
      ValidityPeriod: a.ValidityPeriod || "",
      Status: a.Status || "In force",
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ADD or EDIT (POST /add or PUT /:code)
  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      AgreementCode: form.AgreementCode,
      AgreementName: form.AgreementName,
      CountriesIncluded: form.CountriesIncluded,
      ValidityPeriod: form.ValidityPeriod,
      Status: form.Status,
    };

    try {
      let url;
      let method;

      if (isEdit && editingCode) {
        url = `http://localhost:5000/api/agreements/${editingCode}`;
        method = "PUT";
      } else {
        url = "http://localhost:5000/api/agreements/add";
        method = "POST";
      }

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setShowForm(false);
      setForm(EMPTY_FORM);
      setIsEdit(false);
      setEditingCode(null);
      loadAgreements();
    } catch (err) {
      console.error("Save error", err);
      alert("Save failed. Check backend console.");
    }
  };

  // DELETE → DELETE /api/agreements/:code
  const handleDelete = async (code) => {
    if (!window.confirm("Delete this agreement?")) return;

    try {
      await fetch(`http://localhost:5000/api/agreements/${code}`, {
        method: "DELETE",
      });

      setAgreements((prev) =>
        prev.filter((a) => a.AgreementCode !== code)
      );
    } catch (err) {
      console.error("Delete error", err);
      alert("Delete failed. Check backend console.");
    }
  };

  return (
    <div className="agreements-page">
      <header className="agreements-header">
        <h1>Agreements Management</h1>
      </header>

      <div className="agreements-toolbar">
        <div className="breadcrumb">
          <span className="breadcrumb-home">🏠</span>
          <span className="breadcrumb-sep">/</span>
          <span>Agreements Management</span>
        </div>

        <div className="toolbar-row">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by agreement name, code, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>In force</option>
            <option>Superseded/Suspended</option>
            <option>Deleted/Superseded</option>
          </select>

          <button className="add-agreement-btn" onClick={openAddForm}>
            + Add Agreement
          </button>
        </div>
      </div>

      <main className="agreements-content">
        <div className="agreements-card">
          <div className="agreements-card-header">
            <div>
              <h2>Trade Agreements ({filtered.length})</h2>
            </div>
            <span className="total-count">
              Total: {agreements.length} agreements
            </span>
          </div>

          <table className="agreements-table">
            <thead>
              <tr>
                <th>Agreement Code</th>
                <th>Agreement Name</th>
                <th>Countries Included</th>
                <th>Validity Period</th>
                <th>Status</th>
                <th>Version</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, index) => (
                <tr key={index}>
                  <td>
                    <button className="code-pill">{a.AgreementCode}</button>
                  </td>
                  <td>{a.AgreementName}</td>
                  <td>
                    {(a.CountriesIncluded || "")
                      .split(",")
                      .map((c) => c.trim())
                      .filter(Boolean)
                      .map((c) => (
                        <span key={c} className="country-pill">
                          {c}
                        </span>
                      ))}
                  </td>
                  <td className="validity-cell">
                    <span>{a.ValidityPeriod}</span>
                    <span className="copy-icon">📋</span>
                  </td>
                  <td>
                    <span
                      className={
                        a.Status === "In force"
                          ? "status-pill active"
                          : a.Status === "Superseded/Suspended"
                          ? "status-pill pending"
                          : a.Status === "Deleted/Superseded"
                          ? "status-pill inactive"
                          : "status-pill inactive"
                      }
                    >
                      {a.Status}
                    </span>
                  </td>
                  <td>
                    <span className="version-pill">
                      {a.Version ? `v${a.Version}` : "v1"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn blue"
                      onClick={() => openEditForm(a)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn red"
                      onClick={() => handleDelete(a.AgreementCode)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-row">
                    No agreements match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL FORM LIKE FIRST IMAGE */}
        {showForm && (
          <div
            className="agreements-form-backdrop"
            onClick={() => setShowForm(false)}
          >
            <div
              className="agreements-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="agreements-form-modal-header">
                <h3>{isEdit ? "Edit Agreement" : "Add Agreement"}</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="agreements-form-modal-body">
                <label>
                  Agreement Code
                  <input
                    name="AgreementCode"
                    value={form.AgreementCode}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <label>
                  Agreement Name
                  <input
                    name="AgreementName"
                    value={form.AgreementName}
                    onChange={handleFormChange}
                    required
                  />
                </label>

                <label>
                  Countries Included
                  <input
                    name="CountriesIncluded"
                    value={form.CountriesIncluded}
                    onChange={handleFormChange}
                    placeholder="United States; Australia"
                  />
                </label>

                <label>
                  Validity Period
                  <input
                    name="ValidityPeriod"
                    value={form.ValidityPeriod}
                    onChange={handleFormChange}
                    placeholder="2005-01-01 to 2025-12-03"
                  />
                </label>

                <label>
                  Status
                  <select
                    name="Status"
                    value={form.Status}
                    onChange={handleFormChange}
                  >
                    <option value="In force">In force</option>
                    <option value="Superseded/Suspended">
                      Superseded/Suspended
                    </option>
                    <option value="Deleted/Superseded">
                      Deleted/Superseded
                    </option>
                  </select>
                </label>

                <div className="form-buttons modal-buttons">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {isEdit ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AgreementsManagementPage;
