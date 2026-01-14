import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  Rocket,
  User,
  IdCard,
  Briefcase,
  Check,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Stored user data:", data.user);

      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 pt-24 md:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#1a1a2e]/80 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5"
      >
        {/* Left Panel - Image */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-violet-900/50 to-indigo-900/50 p-8 flex-col justify-between">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Logo & Back */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-violet-400" />
              <span className="text-xl font-bold text-white">UniVerse</span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/80 text-sm hover:bg-white/20 transition-colors"
            >
              Back to website
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tagline */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Join the Universe,
              <br />
              Shape Your Journey
            </h2>
            {/* Dots indicator */}
            <div className="flex gap-2 mt-6">
              <div className="w-8 h-1.5 rounded-full bg-white/30" />
              <div className="w-8 h-1.5 rounded-full bg-violet-500" />
              <div className="w-8 h-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <Rocket className="w-6 h-6 text-violet-400" />
            <span className="text-xl font-bold text-white">UniVerse</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create an account
          </h1>
          <p className="text-starlight/50 mb-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 underline"
            >
              Log in
            </Link>
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span className="text-sm text-rose-300">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/30" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/30" />
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="Student ID"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/30" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                required
              />
            </div>

            {/* Role */}
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/30" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all appearance-none cursor-pointer text-sm"
                required
              >
                <option value="student" className="bg-[#1a1a2e]">
                  Student
                </option>
                <option value="organizer" className="bg-[#1a1a2e]">
                  Organizer
                </option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-starlight/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-starlight/30" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-starlight/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-starlight/30 hover:text-starlight/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  agreeTerms
                    ? "bg-violet-600 border-violet-600"
                    : "bg-white/5 border-white/20 group-hover:border-violet-500/50"
                }`}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-starlight/50">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-violet-400 hover:text-violet-300 underline"
                >
                  Terms & Conditions
                </a>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-starlight/30">Or register with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              <span className="text-sm">Apple</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
