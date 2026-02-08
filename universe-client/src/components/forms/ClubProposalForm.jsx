import { useState, useEffect, useRef } from "react";
import {
  School,
  UserCheck,
  FileUp,
  CheckCircle,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Stepper, { Step } from "@/components/Stepper";

// Step Configuration (for Info Panel primarily)

const STEPS_INFO = [
  { id: 1, label: "Organization details", icon: School },
  { id: 2, label: "Administrative", icon: UserCheck },
  { id: 3, label: "Documents", icon: FileUp },
  { id: 4, label: "Review details", icon: CheckCircle },
];

const ClubProposalForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    clubName: "",
    category: "",
    mission: "",
    advisorName: "",
    committeeSize: "",
    constitution: null,
    consentLetter: null,
    logo: null,
    banner: null,
  });

  const constitutionRef = useRef(null);
  const consentLetterRef = useRef(null);
  const logoRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 5MB.",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: file }));
      toast.success(
        `${field === "constitution" ? "Constitution" : field === "consentLetter" ? "Consent Letter" : field === "logo" ? "Logo" : "Banner"} selected`,
        {
          description: file.name,
        },
      );
    }
  };

  const handleFinalStepCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (
          key !== "constitution" &&
          key !== "consentLetter" &&
          key !== "logo" &&
          key !== "banner"
        ) {
          data.append(key, formData[key]);
        }
      });

      // Append files
      if (formData.constitution)
        data.append("constitution", formData.constitution);
      if (formData.consentLetter)
        data.append("consentLetter", formData.consentLetter);
      if (formData.logo) data.append("logo", formData.logo);
      if (formData.banner) data.append("banner", formData.banner);

      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        const error = await res.json();
        toast.error("Submission Failed", {
          description:
            error.message ||
            "Failed to submit proposal. Please check your data.",
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Network Error", {
        description: "Could not reach the server to submit your proposal.",
      });
    }
  };

  // Success State
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mx-auto bg-card border border-border rounded-2xl p-12 text-center shadow-lg"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-500/10 text-emerald-500 p-6 rounded-full">
            <CheckCircle className="w-20 h-20" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-foreground">
          Proposal Submitted Successfully!
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Pending Review via UniVerse Admin
        </div>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
          Your proposal for{" "}
          <span className="font-semibold text-foreground">
            {formData.clubName}
          </span>{" "}
          has been received. You will be notified once the HEP office reviews
          your documents.
        </p>
        <button
          onClick={() => (window.location.href = "/communities")}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Communities
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
      {/* LEFT: Stepper & Form */}
      <div className="flex-1 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full h-full">
          <Stepper
            initialStep={1}
            onStepChange={(step) => setCurrentStep(step)}
            onFinalStepCompleted={handleFinalStepCompleted}
            backButtonText="Back"
            nextButtonText="Continue"
            stepCircleContainerClassName="shadow-none border-0 bg-transparent"
            stepContainerClassName="px-8 pt-8 pb-4"
            contentClassName="px-8 pb-8"
            footerClassName="px-8 pb-8"
          >
            {/* Step 1: Organization Details */}
            <Step>
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Organization Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Club Name
                    </label>
                    <input
                      name="clubName"
                      value={formData.clubName}
                      onChange={handleChange}
                      className="w-full bg-background border border-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      placeholder="e.g. UiTM Robotics"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-background border border-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Club Logo
                    </label>
                    <div
                      onClick={() => logoRef.current.click()}
                      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-32 ${
                        formData.logo
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-border hover:border-violet-500/50 bg-muted/20"
                      }`}
                    >
                      <input
                        type="file"
                        ref={logoRef}
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="hidden"
                        accept="image/*"
                      />
                      {formData.logo ? (
                        <div className="space-y-1">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="text-xs text-emerald-500 truncate max-w-[150px]">
                            {formData.logo.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                          <p className="text-xs text-muted-foreground">
                            Upload Logo
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Club Banner
                    </label>
                    <div
                      onClick={() => bannerRef.current.click()}
                      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all h-32 ${
                        formData.banner
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-border hover:border-violet-500/50 bg-muted/20"
                      }`}
                    >
                      <input
                        type="file"
                        ref={bannerRef}
                        onChange={(e) => handleFileChange(e, "banner")}
                        className="hidden"
                        accept="image/*"
                      />
                      {formData.banner ? (
                        <div className="space-y-1">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="text-xs text-emerald-500 truncate max-w-[150px]">
                            {formData.banner.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                          <p className="text-xs text-muted-foreground">
                            Upload Banner
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Mission Statement
                  </label>
                  <textarea
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background border border-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none"
                    placeholder="Describe your club's vision..."
                  />
                </div>
              </div>
            </Step>

            {/* Step 2: Administrative */}
            <Step>
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Administrative Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Faculty Advisor
                    </label>
                    <input
                      name="advisorName"
                      value={formData.advisorName}
                      onChange={handleChange}
                      className="w-full bg-background border border-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      placeholder="Lecturer Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                      Committee Size
                    </label>
                    <input
                      type="number"
                      name="committeeSize"
                      value={formData.committeeSize}
                      onChange={handleChange}
                      className="w-full bg-background border border-input rounded-lg px-4 py-3 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                      placeholder="Min. 5"
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 3: Documents */}
            <Step>
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Document Uploads
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {/* Proposed Constitution */}
                  <div
                    onClick={() => constitutionRef.current.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                      formData.constitution
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border hover:border-violet-500/50 bg-muted/20"
                    }`}
                  >
                    <input
                      type="file"
                      ref={constitutionRef}
                      onChange={(e) => handleFileChange(e, "constitution")}
                      className="hidden"
                      accept=".pdf"
                    />
                    <div
                      className={`p-3 rounded-full mb-3 shadow-sm transition-colors ${
                        formData.constitution
                          ? "bg-emerald-500 text-white"
                          : "bg-background group-hover:bg-violet-500 group-hover:text-white"
                      }`}
                    >
                      {formData.constitution ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="font-medium text-foreground">
                      Proposed Constitution
                    </h4>
                    {formData.constitution ? (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-emerald-500 font-medium truncate max-w-[200px]">
                          {formData.constitution.name}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              constitution: null,
                            }));
                          }}
                          className="p-1 hover:bg-emerald-500/10 rounded-full text-emerald-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Max 5MB
                      </p>
                    )}
                  </div>

                  {/* Advisor Consent Letter */}
                  <div
                    onClick={() => consentLetterRef.current.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                      formData.consentLetter
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-border hover:border-violet-500/50 bg-muted/20"
                    }`}
                  >
                    <input
                      type="file"
                      ref={consentLetterRef}
                      onChange={(e) => handleFileChange(e, "consentLetter")}
                      className="hidden"
                      accept=".pdf,image/*"
                    />
                    <div
                      className={`p-3 rounded-full mb-3 shadow-sm transition-colors ${
                        formData.consentLetter
                          ? "bg-emerald-500 text-white"
                          : "bg-background group-hover:bg-violet-500 group-hover:text-white"
                      }`}
                    >
                      {formData.consentLetter ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="font-medium text-foreground">
                      Advisor Consent Letter
                    </h4>
                    {formData.consentLetter ? (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-emerald-500 font-medium truncate max-w-[200px]">
                          {formData.consentLetter.name}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({
                              ...prev,
                              consentLetter: null,
                            }));
                          }}
                          className="p-1 hover:bg-emerald-500/10 rounded-full text-emerald-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF or Image
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 4: Review */}
            <Step>
              <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Review Application
                </h2>
                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Club Name</span>
                    <span className="font-medium text-foreground">
                      {formData.clubName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium text-foreground capitalize">
                      {formData.category || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Advisor</span>
                    <span className="font-medium text-foreground">
                      {formData.advisorName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Committee</span>
                    <span className="font-medium text-foreground">
                      {formData.committeeSize || 0} Members
                    </span>
                  </div>
                  {/* Image Checklist */}
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Visuals</span>
                    <span className="font-medium text-foreground flex gap-2">
                      {formData.logo ? (
                        <span className="text-emerald-500 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Logo
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs">No Logo</span>
                      )}
                      {formData.banner ? (
                        <span className="text-emerald-500 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Banner
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs">No Banner</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>

      {/* RIGHT: Info Panel */}
      <div className="w-full md:w-[350px] bg-muted/20 border-l border-border p-8 md:p-12 hidden md:flex flex-col justify-center rounded-2xl border">
        <div className="mb-8">
          <h3 className="text-2xl font-neuemontreal font-bold mb-2 text-foreground">
            About {STEPS_INFO[currentStep - 1]?.label}
          </h3>
          <p className="text-muted-foreground">
            Enter the basic details about the organization to proceed further.
            Correct information ensures faster approval from HEP.
          </p>
        </div>

        <div className="relative h-64 w-full flex items-end justify-center opacity-50">
          {/* Abstract graphics placeholder */}
          <div className="absolute inset-x-8 bottom-0 h-40 bg-gradient-to-t from-violet-500/20 to-transparent rounded-t-full blur-2xl" />
          <School className="w-32 h-32 text-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
};

export default ClubProposalForm;
