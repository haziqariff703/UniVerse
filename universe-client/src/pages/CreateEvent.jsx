import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

const CreateEvent = () => {
  const [step, setStep] = useState(1);
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const steps = [
    { id: 1, title: "Basics", icon: Info },
    { id: 2, title: "Venue", icon: MapPin },
    { id: 3, title: "Tickets", icon: Tag },
    { id: 4, title: "Media", icon: ImageIcon },
  ];

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-starlight mb-4 text-glow">
          Launch Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Event
          </span>
        </h1>
        <p className="text-starlight/40">
          Broadcasting your vision to the UniVerse
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                  step >= s.id
                    ? "bg-starlight text-black border-starlight shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-nebula/20 text-starlight/20 border-starlight/10"
                }`}
              >
                <s.icon size={20} />
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold ${
                  step >= s.id ? "text-starlight" : "text-starlight/20"
                }`}
              >
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-grow h-[2px] mb-6 transition-all duration-700 ${
                  step > s.id ? "bg-starlight" : "bg-starlight/10"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/5 blur-[100px] pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Give your event a cosmic name..."
                    className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl px-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
                    onChange={handleInputChange}
                    value={formData.title}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() =>
                          setFormData({ ...formData, category: cat })
                        }
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.category === cat
                            ? "bg-violet-500 text-white border-violet-500"
                            : "bg-starlight/5 text-starlight/60 border-starlight/10 hover:border-starlight/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Tell the UniVerse about your mission..."
                    className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl px-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all resize-none"
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-starlight/30"
                      size={18}
                    />
                    <input
                      type="date"
                      name="date"
                      className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl pl-14 pr-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all color-scheme-dark"
                      onChange={handleInputChange}
                      value={formData.date}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-starlight/30"
                      size={18}
                    />
                    <input
                      type="time"
                      name="time"
                      className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl pl-14 pr-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
                      onChange={handleInputChange}
                      value={formData.time}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Venue Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-starlight/30"
                      size={18}
                    />
                    <input
                      type="text"
                      name="venue"
                      placeholder="Where in the galaxy?"
                      className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl pl-14 pr-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Total Capacity
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-starlight/30"
                      size={18}
                    />
                    <input
                      type="number"
                      name="capacity"
                      placeholder="Max attendees"
                      className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl pl-14 pr-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
                      onChange={handleInputChange}
                      value={formData.capacity}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-starlight/60 uppercase tracking-wider ml-1">
                    Ticket Price (RM)
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-starlight/30"
                      size={18}
                    />
                    <input
                      type="number"
                      name="ticketPrice"
                      placeholder="Enter 0 for free"
                      className="w-full bg-starlight/5 border border-starlight/10 rounded-2xl pl-14 pr-6 py-4 text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
                      onChange={handleInputChange}
                      value={formData.ticketPrice}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-starlight mb-2">
                Ready for Lift Off?
              </h3>
              <p className="text-starlight/50 mb-10 max-w-sm mx-auto">
                Everything looks stellar. Your event is ready to be broadcasted
                to the UniVerse.
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-starlight font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all">
                Launch Event
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <div className="flex items-center justify-between mt-12 border-t border-starlight/5 pt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                step === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-starlight/40 hover:text-starlight hover:bg-starlight/5"
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-starlight text-black rounded-xl font-bold hover:bg-violet-400 hover:text-starlight transition-all"
            >
              {step === 3 ? "Review" : "Continue"}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
