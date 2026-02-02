import React, { useState } from "react";
import {
  AlertCircle,
  Loader,
  Upload,
  Sparkles,
  Save,
  ChevronDown,
} from "lucide-react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/dark.css";

const DynamicSteppedForm = ({
  schema,
  onSubmit,
  initialData = {},
  submitLabel = "Publish Event",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const computedSchema =
    typeof schema === "function" ? schema(formData) : schema;
  const [activeSection, setActiveSection] = useState(
    computedSchema.steps[0]?.id || 1,
  );

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

  const renderField = (field) => {
    const commonClasses =
      "w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all";

    return (
      <div
        key={field.name}
        className={`${field.width === "half" ? "" : "col-span-1 md:col-span-2"} space-y-2`}
      >
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          {field.label}{" "}
          {field.required && <span className="text-rose-500">*</span>}
        </label>

        {field.type === "text" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors"
                size={18}
              />
            )}
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              className={`${commonClasses} ${field.icon ? "pl-11" : ""}`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "number" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors"
                size={18}
              />
            )}
            <input
              type="number"
              name={field.name}
              placeholder={field.placeholder}
              className={`${commonClasses} ${field.icon ? "pl-11" : ""}`}
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors"
                size={18}
              />
            )}
            <input
              type="date"
              name={field.name}
              className={`${commonClasses} ${field.icon ? "pl-11" : ""} color-scheme-dark`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "time" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors"
                size={18}
              />
            )}
            <input
              type="time"
              name={field.name}
              className={`${commonClasses} ${field.icon ? "pl-11" : ""} color-scheme-dark`}
              onChange={handleInputChange}
              value={formData[field.name] || ""}
            />
          </div>
        )}

        {field.type === "select" && (
          <div className="relative group">
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleSelectChange(field.name, e.target.value)}
              className={`${commonClasses} appearance-none cursor-pointer ${
                !formData[field.name] ? "text-zinc-600" : ""
              }`}
            >
              <option value="" disabled>
                Select an option
              </option>
              {field.options &&
                field.options.map((opt) => {
                  const value = typeof opt === "object" ? opt.value : opt;
                  const label = typeof opt === "object" ? opt.label : opt;
                  return (
                    <option
                      key={value}
                      value={value}
                      className="bg-zinc-900 text-white"
                    >
                      {label}
                    </option>
                  );
                })}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              size={16}
            />
          </div>
        )}

        {field.type === "datetime-picker" && (
          <div className="relative group">
            {field.icon && (
              <field.icon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors z-10"
                size={18}
              />
            )}
            <Flatpickr
              value={formData[field.name]}
              onChange={([date]) => handleSelectChange(field.name, date)}
              options={{
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
                disable: field.disabledDates || [],
                ...(field.flatpickrOptions || {}),
              }}
              className={`${commonClasses} ${field.icon ? "pl-11" : ""} cursor-pointer`}
              placeholder={field.placeholder || "Select Date & Time"}
            />
          </div>
        )}

        {field.type === "multi-select" && (
          <div className="flex flex-wrap gap-2">
            {field.options &&
              field.options.map((opt) => {
                const value = typeof opt === "object" ? opt.value : opt;
                const label = typeof opt === "object" ? opt.label : opt;
                const isSelected =
                  Array.isArray(formData[field.name]) &&
                  formData[field.name].includes(value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      const current = Array.isArray(formData[field.name])
                        ? formData[field.name]
                        : [];
                      const updated = isSelected
                        ? current.filter((v) => v !== value)
                        : [...current, value];
                      handleSelectChange(field.name, updated);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            {(!field.options || field.options.length === 0) && (
              <p className="text-xs text-zinc-600 italic">
                No options available
              </p>
            )}
          </div>
        )}

        {field.type === "file" && (
          <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-8 text-center hover:border-zinc-700 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept={field.accept}
              onChange={(e) => handleFileChange(e, field.name)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData[field.name] ? (
              <div className="relative z-10">
                {/* Handle File Object (New Upload) or String (Existing URL) */}
                {(formData[field.name] instanceof File &&
                  (formData[field.name].name.endsWith(".pdf") ||
                    formData[field.name].type === "application/pdf")) ||
                (typeof formData[field.name] === "string" &&
                  formData[field.name].endsWith(".pdf")) ? (
                  <div className="w-full h-48 rounded-lg mb-3 border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center p-4">
                    <Save className="w-10 h-10 text-violet-500 mb-2" />
                    <a
                      href={
                        typeof formData[field.name] === "string"
                          ? `http://localhost:5000/${formData[field.name]}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 font-mono break-all hover:text-white transition-colors"
                      onClick={(e) =>
                        formData[field.name] instanceof File &&
                        e.preventDefault()
                      }
                    >
                      {formData[field.name] instanceof File
                        ? formData[field.name].name
                        : "View Current PDF"}
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-3 border border-zinc-800">
                    <img
                      src={
                        formData[field.name] instanceof File
                          ? URL.createObjectURL(formData[field.name])
                          : `http://localhost:5000/${formData[field.name]}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-zinc-300 font-medium text-sm">
                  {formData[field.name] instanceof File
                    ? formData[field.name].name
                    : "Current File"}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Click to replace</p>
              </div>
            ) : (
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-300 font-medium">
                    {field.accept?.includes(".pdf")
                      ? "Upload Event Proposal"
                      : "Upload Event Artwork"}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {field.accept?.includes(".pdf")
                      ? "PDF (Max 5MB)"
                      : "JPG, PNG, WEBP (Max 5MB)"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {field.note && (
          <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/10 flex gap-3 mt-1">
            <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              {field.note}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {error && (
          <div className="m-6 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center gap-3 text-rose-400">
            <AlertCircle size={18} />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        <div className="divide-y divide-zinc-900">
          {computedSchema.steps.map((section, index) => {
            // Skip review step or steps with no fields
            if (
              section.type === "review" ||
              !section.fields ||
              section.fields.length === 0
            )
              return null;

            const isActive = activeSection === section.id;

            return (
              <div key={section.id} className="transition-all duration-300">
                <button
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className={`w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors ${isActive ? "bg-zinc-900/30" : "hover:bg-zinc-900/10"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isActive ? "bg-violet-500 border-violet-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                    >
                      {section.icon ? (
                        <section.icon size={18} />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold transition-colors ${isActive ? "text-white" : "text-zinc-400"}`}
                      >
                        {section.title}
                      </h3>
                      <p className="text-xs text-zinc-500 hidden sm:block">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="text-zinc-500" size={20} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-dashed border-zinc-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {section.fields.map(renderField)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-10 bg-zinc-950 border-t border-zinc-900 sticky bottom-0 z-10">
          <button
            onClick={submitForm}
            disabled={loading}
            className="w-full px-8 py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save size={18} />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicSteppedForm;
