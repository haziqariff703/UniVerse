import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import ClubProposalForm from "@/components/forms/ClubProposalForm";

const ClubProposal = () => {
  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-8"
        >
          <div className="inline-block px-3 py-1 bg-violet-500/10 text-violet-500 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Student Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-neuemontreal font-bold text-foreground">
            Start a Club
          </h1>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ClubProposalForm />
        </motion.div>
      </div>
    </div>
  );
};

export default ClubProposal;
