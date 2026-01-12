import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Mail, Lock } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-36 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md relative overflow-hidden"
      >
        {/* Background shine */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-lg shadow-accent/10">
              <Rocket className="text-accent w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold font-neuemontreal text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-starlight/60">
            Enter the portal provided by your credentials.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-starlight/80 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40 w-5 h-5" />
              <input
                type="email"
                placeholder="voyager@universe.io"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-starlight/80 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40 w-5 h-5" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/50 checked:bg-accent transition-colors"
              />
              <span className="text-starlight/60 group-hover:text-starlight/80 transition-colors">
                Remember me
              </span>
            </label>
            <a
              href="#"
              className="text-accent hover:text-white transition-colors"
            >
              Lost keys?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all"
          >
            Initiate Launch
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-starlight/50 text-sm">
            New to the galaxy?{" "}
            <Link
              to="/signup"
              className="text-white hover:text-accent font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
