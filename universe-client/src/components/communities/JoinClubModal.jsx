import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

const JoinClubModal = ({ isOpen, onClose, clubName }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: "", studentId: "", email: "", reason: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#0F0F1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">
            Join <span className="text-violet-400">{clubName}</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Student ID
                </label>
                <input
                  required
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="e.g. 20261234"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  University Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="student@university.edu"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Why do you want to join?
                </label>
                <textarea
                  required
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  placeholder="Vibe check! Tell us briefly..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-violet-500/25 transition-all mt-4 transform active:scale-95"
              >
                Submit Application
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Application Sent!
              </h3>
              <p className="text-gray-400 mb-6">
                You're one step closer to being a member. The generated perks
                and events await!
              </p>
              <button
                onClick={handleClose}
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JoinClubModal;
