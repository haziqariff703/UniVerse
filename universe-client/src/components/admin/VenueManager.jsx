import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  RefreshCw,
  ArrowLeft,
  Users,
} from "lucide-react";

const VenueManager = ({ onBack }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location_code: "",
    max_capacity: "",
    facilities: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch venues");

      const data = await response.json();
      setVenues(data.venues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingVenue(null);
    setFormData({
      name: "",
      location_code: "",
      max_capacity: "",
      facilities: "",
    });
    setShowModal(true);
  };

  const openEditModal = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location_code: venue.location_code,
      max_capacity: venue.max_capacity.toString(),
      facilities: venue.facilities?.join(", ") || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVenue(null);
    setFormData({
      name: "",
      location_code: "",
      max_capacity: "",
      facilities: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const facilitiesArray = formData.facilities
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      const payload = {
        name: formData.name,
        location_code: formData.location_code,
        max_capacity: parseInt(formData.max_capacity),
        facilities: facilitiesArray,
      };

      const url = editingVenue
        ? `http://localhost:5000/api/admin/venues/${editingVenue._id}`
        : "http://localhost:5000/api/admin/venues";

      const response = await fetch(url, {
        method: editingVenue ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save venue");
      }

      closeModal();
      fetchVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/venues/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete venue");
      }

      setVenues(venues.filter((v) => v._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <RefreshCw
          size={32}
          className="mx-auto text-violet-400 animate-spin mb-4"
        />
        <p className="text-starlight/60">Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-starlight">Venue Manager</h2>
            <p className="text-starlight/40 text-sm">
              {venues.length} venue{venues.length !== 1 ? "s" : ""} registered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVenues}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
          >
            <Plus size={18} />
            Add Venue
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          {error}
          <button onClick={() => setError(null)} className="ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Venues Grid */}
      {venues.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <MapPin size={48} className="mx-auto text-starlight/20 mb-4" />
          <h3 className="text-xl font-bold text-starlight mb-2">
            No Venues Yet
          </h3>
          <p className="text-starlight/40 mb-4">
            Add your first venue to get started.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
          >
            Add First Venue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="glass-panel rounded-2xl p-6 border border-starlight/5 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-starlight">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-2 text-starlight/50 text-sm mt-1">
                    <MapPin size={14} />
                    <span>{venue.location_code}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(venue)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-starlight/40 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(venue._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-starlight/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-starlight/60 text-sm mb-3">
                <Users size={14} />
                <span>Capacity: {venue.max_capacity}</span>
              </div>

              {venue.facilities?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {venue.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md text-xs font-bold bg-starlight/5 text-starlight/60"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative glass-panel rounded-3xl p-8 w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-starlight/40 hover:text-starlight transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-starlight mb-6">
              {editingVenue ? "Edit Venue" : "Add New Venue"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-starlight/60 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-starlight/5 border border-starlight/10 text-starlight placeholder-starlight/30 focus:outline-none focus:border-violet-500"
                  placeholder="e.g., Main Hall"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-starlight/60 mb-2">
                  Location Code
                </label>
                <input
                  type="text"
                  value={formData.location_code}
                  onChange={(e) =>
                    setFormData({ ...formData, location_code: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-starlight/5 border border-starlight/10 text-starlight placeholder-starlight/30 focus:outline-none focus:border-violet-500"
                  placeholder="e.g., A-101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-starlight/60 mb-2">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, max_capacity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-starlight/5 border border-starlight/10 text-starlight placeholder-starlight/30 focus:outline-none focus:border-violet-500"
                  placeholder="e.g., 500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-starlight/60 mb-2">
                  Facilities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) =>
                    setFormData({ ...formData, facilities: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-starlight/5 border border-starlight/10 text-starlight placeholder-starlight/30 focus:outline-none focus:border-violet-500"
                  placeholder="e.g., Projector, AC, WiFi"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {editingVenue ? "Update Venue" : "Create Venue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManager;
