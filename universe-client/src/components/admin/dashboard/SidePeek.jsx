import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidePeek = ({ isOpen, onClose, title, children, actions }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-[#0a0a1a] border-l border-starlight/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-starlight/5 bg-starlight/5 backdrop-blur-md">
              <h2 className="text-xl font-bold text-starlight line-clamp-1">
                {title}
              </h2>
              <div className="flex items-center gap-2">
                {actions}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-starlight/10 text-starlight/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePeek;

