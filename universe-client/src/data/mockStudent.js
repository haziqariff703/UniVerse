export const MOCK_STUDENT_PROFILE = {
  name: "Student",
  studentId: "000000000",
  program: "Computer Science (CS230)",
  semester: "Sem 04",
  avatar: "",
  coverImage: "",

  // Gamification
  rank: "Rising Star",
  xp: 750,
  maxXp: 1000,
  level: 12,

  // Module 1: Student DNA (Tags)
  dna: ["#AI_ML", "#Leadership", "#Hackathons", "#FullStack", "#UI_UX"],

  // Module 2: Current Loadout (Academics)
  loadout: [
    { code: "CSC404", name: "Programming II", status: "Active" },
    { code: "CSC413", name: "Data Structures", status: "Active" },
    { code: "MAT421", name: "Calc I", status: "Completed" },
    { code: "STA404", name: "Statistics", status: "Active" },
  ],

  // Module 3: Quest Log (Recent Activity)
  questLog: [
    {
      id: 1,
      title: "TEDxUiTM: Breaking Barriers",
      xp: "+25 XP",
      date: "2 hours ago",
      type: "Event",
    },
    {
      id: 2,
      title: "Neon Run: Night Edition",
      xp: "+30 XP",
      date: "Yesterday",
      type: "Activity",
    },
    {
      id: 3,
      title: "Intro to Python Workshop",
      xp: "+15 XP",
      date: "3 days ago",
      type: "Workshop",
    },
  ],

  // Module 4: Decrypted Assets (Certificates)
  assets: [
    {
      id: 1,
      name: "Dean's List Certificate (Sem 3)",
      type: "PDF",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "TEDx Participation Transcript",
      type: "PDF",
      size: "1.1 MB",
    },
    { id: 3, name: "Hackathon Winner Badge", type: "PNG", size: "0.5 MB" },
  ],
};
