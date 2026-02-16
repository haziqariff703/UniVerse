import { motion } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";
import fpmImage from "@/assets/faculties/fpm.png";
import fitaImage from "@/assets/faculties/fita.png";

// Official Faculty Data for UiTM Puncak Perdana
const facultyData = [
  {
    id: "fpm",
    name: "Information Management",
    fullName: "Fakulti Pengurusan Maklumat",
    image: fpmImage,
    color: "cyan",
    tagline: "Records Management, Library Science, and Digital Archives",
    programs: {
      diploma: ["IM110: Diploma in Information Management"],
      degree: [
        "Library Management",
        "Information Systems Management",
        "Records Management",
        "Resource Centre Management",
        "Information Content Management",
      ],
    },
  },
  {
    id: "fita",
    name: "Film, Theatre & Animation",
    fullName: "Fakulti Filem, Teater & Animasi",
    image: fitaImage,
    color: "purple",
    tagline: "Film Production, Theatre Arts, and Cinematic Storytelling",
    programs: {
      diploma: [
        "Theatre",
        "Arts Management",
        "Animation",
        "Dance",
        "Film",
        "Creative Writing",
      ],
      degree: [
        "Film Directing",
        "Cinematography",
        "Creative Technology (Screen)",
        "2D & 3D Animation Production",
        "Creative Industry Management",
      ],
    },
  },
];

const FacultyShowcase = () => {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Faculty
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Discover events tailored to your course at Puncak Perdana
          </p>
        </div>

        {/* Dual Faculty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {facultyData.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Card Container */}
              <div
                className={`relative h-[500px] rounded-3xl overflow-hidden
                  border ${
                    faculty.color === "cyan"
                      ? "border-cyan-500/30 hover:border-cyan-500/60"
                      : "border-purple-500/30 hover:border-purple-500/60"
                  }
                  bg-slate-950/40 backdrop-blur-xl
                  transition-all duration-500
                  shadow-[0_0_40px_rgba(${
                    faculty.color === "cyan" ? "6,182,212" : "168,85,247"
                  },0.15)]
                  hover:shadow-[0_0_60px_rgba(${
                    faculty.color === "cyan" ? "6,182,212" : "168,85,247"
                  },0.3)]`}
              >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    src={faculty.image}
                    alt={faculty.fullName}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      faculty.color === "cyan"
                        ? "from-slate-950 via-slate-950/90 to-cyan-950/30"
                        : "from-slate-950 via-slate-950/90 to-purple-950/30"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  {/* Faculty Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                        border ${
                          faculty.color === "cyan"
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                            : "border-purple-500/50 bg-purple-500/10 text-purple-300"
                        }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      {faculty.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Faculty Name */}
                  <h3 className="text-3xl md:text-4xl font-clash font-bold text-white mb-2">
                    {faculty.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 ${
                      faculty.color === "cyan"
                        ? "text-cyan-300/80"
                        : "text-purple-300/80"
                    }`}
                  >
                    {faculty.tagline}
                  </p>

                  {/* Programs Preview (Always Visible) */}
                  <div className="space-y-4 mb-6">
                    {/* Diploma Programs */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Diploma Programmes
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {faculty.programs.diploma
                          .slice(0, 2)
                          .map((program, i) => (
                            <p key={i} className="text-sm text-foreground/90">
                              • {program}
                            </p>
                          ))}
                        {faculty.programs.diploma.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{faculty.programs.diploma.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Degree Programs Preview */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Bachelor's Programmes (Honours)
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {faculty.programs.degree
                          .slice(0, 3)
                          .map((program, i) => (
                            <p key={i} className="text-sm text-foreground/90">
                              • {program}
                            </p>
                          ))}
                        {faculty.programs.degree.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{faculty.programs.degree.length - 3} more
                            specializations
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Full Program List (On Hover) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl p-8
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      overflow-y-auto scrollbar-hide"
                  >
                    <h3 className="text-2xl font-clash font-bold text-white mb-6">
                      All Programmes
                    </h3>

                    {/* Full Diploma List */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Diploma Programmes
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {faculty.programs.diploma.map((program, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                              faculty.color === "cyan"
                                ? "border-cyan-500/20 bg-cyan-500/5"
                                : "border-purple-500/20 bg-purple-500/5"
                            }`}
                          >
                            <p className="text-sm text-foreground">{program}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Degree List */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Bachelor's Programmes (Honours)
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {faculty.programs.degree.map((program, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                              faculty.color === "cyan"
                                ? "border-cyan-500/20 bg-cyan-500/5"
                                : "border-purple-500/20 bg-purple-500/5"
                            }`}
                          >
                            <p className="text-sm text-foreground">{program}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-clash font-semibold text-sm
                      transition-all duration-300 ${
                        faculty.color === "cyan"
                          ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      }`}
                  >
                    Explore {faculty.id.toUpperCase()} Events
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultyShowcase;
