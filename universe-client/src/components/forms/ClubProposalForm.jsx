import { useState } from "react";
import {
  School,
  UserCheck,
  FileUp,
  CheckCircle,
  Upload,
  Info,
  Check,
} from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1); // Track step for Info Panel
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    clubName: "",
    category: "",
    mission: "",
    advisorName: "",
    committeeSize: "",
    constitution: null,
    consentLetter: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalStepCompleted = () => {
    setTimeout(() => setIsSubmitted(true), 500);
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

  // Determine if current step is valid to enable/disable Next button
  // Note: Since we don't have easy access to disable the Stepper button dynamically per step without re-render,
  // we are relying on the user filling data. For this implementation, we won't strictly block "Next" to keep it fluid,
  // or we could pass `nextButtonProps={{ disabled: !isValid }}` if we calculated `isValid` per step.

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
                      <option value="sports">Sports</option>
                      <option value="arts">Arts</option>
                      <option value="tech">Technology</option>
                      <option value="education">Education</option>
                      <option value="religion">Religion</option>
                    </select>
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
                  <div className="border-2 border-dashed border-border hover:border-violet-500/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-muted/20 group">
                    <div className="bg-background p-3 rounded-full mb-3 shadow-sm group-hover:bg-violet-500 group-hover:text-white transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="font-medium text-foreground">
                      Proposed Constitution
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, Max 5MB
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-border hover:border-violet-500/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-muted/20 group">
                    <div className="bg-background p-3 rounded-full mb-3 shadow-sm group-hover:bg-violet-500 group-hover:text-white transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="font-medium text-foreground">
                      Advisor Consent Letter
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF or Image
                    </p>
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
