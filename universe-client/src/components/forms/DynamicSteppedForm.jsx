import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader,
  Upload,
  Sparkles,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const DynamicSteppedForm = ({ schema, onSubmit, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  // Initialize formData based on initialData (for edit) or empty
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < schema.steps.length) setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const submitForm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const currentStepConfig = schema.steps.find((s) => s.id === step);

  const renderField = (field) => {
    const commonClasses =
      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all";

    return (
      <div
        key={field.name}
        className={`${field.width === "half" ? "" : "col-span-1 md:col-span-2"} space-y-3`}
      >
        <label className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {field.label}{" "}
          {field.required && <span className="text-rose-400">*</span>}
        </label>

        {field.type === "text" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                size={20}
              />
            )}
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              className={`${commonClasses} ${field.icon ? "pl-12" : ""}`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "number" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                size={20}
              />
            )}
            <input
              type="number"
              name={field.name}
              placeholder={field.placeholder}
              className={`${commonClasses} ${field.icon ? "pl-12" : ""}`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "textarea" && (
          <textarea
            name={field.name}
            rows={field.rows || 4}
            placeholder={field.placeholder}
            className={`${commonClasses} resize-none`}
            onChange={handleInputChange}
            value={formData[field.name] || ""}
          ></textarea>
        )}

        {field.type === "date" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                size={20}
              />
            )}
            <input
              type="date"
              name={field.name}
              className={`${commonClasses} ${field.icon ? "pl-12" : ""} color-scheme-dark`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "time" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors"
                size={20}
              />
            )}
            <input
              type="time"
              name={field.name}
              className={`${commonClasses} ${field.icon ? "pl-12" : ""} color-scheme-dark`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "select" && (
          <div className="flex flex-wrap gap-3">
            {field.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectChange(field.name, opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  formData[field.name] === opt
                    ? "bg-violet-500/20 border-violet-500 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {field.type === "file" && (
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-violet-500/50 hover:bg-white/5 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept={field.accept}
              onChange={(e) => handleFileChange(e, field.name)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData[field.name] ? (
              <div className="relative z-10">
                <div className="w-full h-64 rounded-xl overflow-hidden mb-4 border border-white/20">
                  <img
                    src={URL.createObjectURL(formData[field.name])}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white font-medium">
                  {formData[field.name].name}
                </p>
                <p className="text-sm text-gray-500 mt-2">Click to replace</p>
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
        )}

        {field.note && (
          <div className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/20 flex gap-4 mt-2">
            <Sparkles className="w-6 h-6 text-violet-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-white font-medium mb-1">Note</h4>
              <p className="text-sm text-gray-400">{field.note}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReviewStep = () => {
    // Collect all fields from previous steps to display them
    const allFields = schema.steps.flatMap((s) => s.fields).filter(Boolean);
    const FinalIcon = schema.steps[schema.steps.length - 1].icon;

    return (
      <div className="space-y-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-pulse">
          <FinalIcon size={40} className="text-white" />
        </div>

        <h3 className="text-3xl font-bold text-white mb-2">
          Ready for Lift Off?
        </h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          You're about to launch <strong>{formData.title}</strong> to the entire
          UniVerse. Verify your details below.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-2xl mx-auto">
          {allFields.map((field) => {
            if (
              !formData[field.name] ||
              field.type === "file" ||
              field.type === "textarea"
            )
              return null;
            return (
              <div
                key={field.name}
                className="bg-white/5 p-4 rounded-xl border border-white/5"
              >
                <p className="text-xs text-gray-500 uppercase mb-1">
                  {field.label}
                </p>
                <p className="text-white font-medium truncate">
                  {formData[field.name]}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={submitForm}
          disabled={loading}
          className="w-full md:w-auto px-12 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-violet-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mx-auto mt-8 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Launch Event <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    );
  };

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
            style={{
              width: `${((step - 1) / (schema.steps.length - 1)) * 100}%`,
            }}
          />

          {schema.steps.map((s) => (
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
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {currentStepConfig.type === "review" ? (
              renderReviewStep()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentStepConfig.fields.map(renderField)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < schema.steps.length && (
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

export default DynamicSteppedForm;
