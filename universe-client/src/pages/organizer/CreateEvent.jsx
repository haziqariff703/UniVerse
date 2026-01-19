import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Calendar,
  MapPin,
  Tag,
  Image as ImageIcon,
  Users,
  Clock,
  Info,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader,
  Upload,
  Sparkles,
  Rocket,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    capacity: "",
    ticketPrice: "",
    image: null,
  });

  const categories = [
    "Music",
    "Technology",
    "Art",
    "Sports",
    "Education",
    "Networking",
    "Gaming",
    "Science",
  ];

  useGSAP(
    () => {
      // Title Enter Animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
        );
      }
    },
    { scope: containerRef },
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const nextStep = () => {
    if (step < 5) setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (
        !formData.title ||
        !formData.date ||
        !formData.time ||
        !formData.capacity
      ) {
        throw new Error(
          "Please fill in all required fields (Title, Date, Time, Capacity)",
        );
      }

      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        tags: [formData.category],
        date_time: dateTime.toISOString(),
        location: formData.venue,
        capacity: parseInt(formData.capacity),
        // image: formData.image (Handle file upload logic if backend supports it)
      };

      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to launch an event.");

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to launch event");
      }

      navigate("/events");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Basics", icon: Info },
    { id: 2, title: "Schedule", icon: Clock },
    { id: 3, title: "Tickets", icon: Tag },
    { id: 4, title: "Media", icon: ImageIcon },
    { id: 5, title: "Review", icon: Rocket },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-neuemontreal font-bold text-white mb-4 flex flex-wrap justify-center gap-x-4"
        >
          <span>Launch</span>
          <span>Your</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Event
          </span>
        </h1>
        <p className="text-white/40 text-lg animate-fade-in">
          Broadcasting your vision to the UniVerse
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-12 max-w-3xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-violet-600 rounded-full -z-10 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col items-center gap-2 cursor-pointer transition-colors duration-300 ${
                step >= s.id ? "text-white" : "text-white/30"
              }`}
              onClick={() => step > s.id && setStep(s.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 bg-[#0A0A0A] ${
                  step >= s.id
                    ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-110"
                    : "border-white/20 scale-100"
                } ${step > s.id ? "bg-violet-500 border-violet-500" : ""}`}
              >
                {step > s.id ? (
                  <CheckCircle size={18} className="text-white" />
                ) : (
                  <s.icon
                    size={18}
                    className={
                      step >= s.id ? "text-violet-400" : "text-white/30"
                    }
                  />
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <SpotlightCard className="p-8 md:p-12 rounded-[2rem]">
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Event Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="E.g. Cosmic Hackathon 2026"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-lg"
                    onChange={handleInputChange}
                    value={formData.title}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setFormData({ ...formData, category: cat })
                        }
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          formData.category === cat
                            ? "bg-violet-500/20 border-violet-500 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    placeholder="What is this event about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                    onChange={handleInputChange}
                    value={formData.description}
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Date <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="date"
                      name="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all color-scheme-dark"
                      onChange={handleInputChange}
                      value={formData.date}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Time <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative group">
                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="time"
                      name="time"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all color-scheme-dark"
                      onChange={handleInputChange}
                      value={formData.time}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Venue Location
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      name="venue"
                      placeholder="e.g. Grand Hall, Main Campus"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium"
                      onChange={handleInputChange}
                      value={formData.venue}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Max Capacity <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative group">
                    <Users
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="number"
                      name="capacity"
                      placeholder="100"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      onChange={handleInputChange}
                      value={formData.capacity}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Ticket Price (RM)
                  </label>
                  <div className="relative group">
                    <Tag
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="number"
                      name="ticketPrice"
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      onChange={handleInputChange}
                      value={formData.ticketPrice}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/20 flex gap-4">
                <Sparkles className="w-6 h-6 text-violet-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-400">
                    Setting a price of 0 will mark the event as "Free Entry".
                    Paid events will require payment gateway integration (coming
                    soon).
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Event Cover Image
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-violet-500/50 hover:bg-white/5 transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.image ? (
                    <div className="relative z-10">
                      <div className="w-full h-64 rounded-xl overflow-hidden mb-4 border border-white/20">
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white font-medium">
                        {formData.image.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 pointer-events-none">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-violet-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-lg text-white font-medium mb-1">
                          Drop your image here, or browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG, PNG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-pulse">
                <Rocket size={40} className="text-white" />
              </div>

              <h3 className="text-3xl font-bold text-white mb-2">
                Ready for Lift Off?
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                You're about to launch <strong>{formData.title}</strong> to the
                entire UniVerse. Verify your flight details below.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-2xl mx-auto">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                  <p className="text-white font-medium truncate">
                    {formData.date}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Time</p>
                  <p className="text-white font-medium truncate">
                    {formData.time}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Venue</p>
                  <p className="text-white font-medium truncate">
                    {formData.venue}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">Entry</p>
                  <p className="text-white font-medium truncate">
                    {formData.ticketPrice > 0
                      ? `RM ${formData.ticketPrice}`
                      : "Free"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-violet-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto mt-8 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Igniting...
                  </>
                ) : (
                  <>
                    Launch Event <ChevronRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <ChevronLeft size={20} /> Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-medium transition-all shadow-lg shadow-violet-600/20"
            >
              Next Step <ChevronRight size={20} />
            </button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};

export default CreateEvent;
