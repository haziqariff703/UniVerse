import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Plus,
  ArrowLeft,
  Users,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  Loader,
} from "lucide-react";

// Predefined facilities list
const FACILITIES_LIST = [
  "Projector",
  "Whiteboard",
  "Air Conditioning",
  "WiFi",
  "Sound System",
  "Microphone",
  "Video Conferencing",
  "Stage",
  "Catering Area",
  "Parking",
  "Wheelchair Access",
  "Recording Equipment",
];

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location_code: "",
    max_capacity: "",
    facilities: [],
    images: [],
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch venues");

      const data = await response.json();
      setVenues(data.venues || []);
    } catch (err) {
      console.error("Fetch venues error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (venue = null) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        location_code: venue.location_code,
        max_capacity: venue.max_capacity?.toString() || "",
        facilities: venue.facilities || [],
        images: venue.images || [],
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: "",
        location_code: "",
        max_capacity: "",
        facilities: [],
        images: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVenue(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const url = editingVenue
        ? `http://localhost:5000/api/admin/venues/${editingVenue._id}`
        : "http://localhost:5000/api/admin/venues";

      const response = await fetch(url, {
        method: editingVenue ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save venue");
      }

      await fetchVenues();
      handleCloseModal();
    } catch (err) {
      console.error("Save venue error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (venueId) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/venues/${venueId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to delete venue");

      await fetchVenues();
    } catch (err) {
      console.error("Delete venue error:", err);
      alert(err.message);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Venue Management
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage all campus venues and facilities
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Add Venue
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-violet-500" size={32} />
          </div>
        )}

        {/* Venues Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <MapPin className="mx-auto mb-4 text-gray-600" size={48} />
                <h3 className="text-xl text-white font-medium mb-2">
                  No venues yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first venue to get started
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium"
                >
                  Add Venue
                </button>
              </div>
            ) : (
              venues.map((venue) => (
                <div
                  key={venue._id}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300"
                >
                  {/* Venue Image */}
                  <div className="relative h-48 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30">
                    {venue.images && venue.images[0] ? (
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon size={48} className="text-white/20" />
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleOpenModal(venue)}
                        className="p-3 rounded-full bg-white/10 hover:bg-violet-600 text-white transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(venue._id)}
                        className="p-3 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Capacity Badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Users size={12} className="text-violet-400" />
                      <span className="text-xs font-medium text-white">
                        {venue.max_capacity}
                      </span>
                    </div>
                  </div>

                  {/* Venue Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                      <MapPin size={14} />
                      {venue.location_code}
                    </p>

                    {/* Facilities Tags */}
                    {venue.facilities && venue.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {venue.facilities.slice(0, 3).map((facility, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          >
                            {facility}
                          </span>
                        ))}
                        {venue.facilities.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                            +{venue.facilities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingVenue ? "Edit Venue" : "Add New Venue"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {error}
                </div>
              )}

              {/* Venue Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Venue Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Grand Hall"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Location Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Location Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="location_code"
                  value={formData.location_code}
                  onChange={handleInputChange}
                  placeholder="e.g. A-101"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Max Capacity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Max Capacity <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  name="max_capacity"
                  value={formData.max_capacity}
                  onChange={handleInputChange}
                  placeholder="e.g. 500"
                  required
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>

              {/* Facilities Checkboxes */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">
                  Facilities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FACILITIES_LIST.map((facility) => (
                    <label
                      key={facility}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.facilities.includes(facility)
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          formData.facilities.includes(facility)
                            ? "bg-violet-500 border-violet-500"
                            : "border-white/20"
                        }`}
                      >
                        {formData.facilities.includes(facility) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityToggle(facility)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/10 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : editingVenue ? (
                    "Update Venue"
                  ) : (
                    "Create Venue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default VenuesPage;
