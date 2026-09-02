export const site = {
  name: "Arpan Mukherjee",
  emailPrimary: "arpanmukherjee0710@gmail.com",
  emailSecondary: "arpanmukherjee2005@hotmail.com",
  phone: "+917439766325",
  socials: {
    github: {
      label: "GitHub",
      url: "https://github.com/Apumukherjee819",
      handle: "Apumukherjee819",
    },
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/arpan-mukherjee-560b61375/",
      handle: "Arpan Mukherjee",
    },
    codeforces: {
      label: "Codeforces",
      url: "https://codeforces.com/profile/ArpanMukherjee0710",
      handle: "ArpanMukherjee0710",
    },
    leetcode: {
      label: "LeetCode",
      url: "https://leetcode.com/u/apumukherjee819/",
      handle: "apumukherjee819",
    },
  },
};

export const about = {
  title: "About",
  paragraphs: [
    "I'm a B.Sc. student in Statistics (with a Computer Science minor) at Ramakrishna Mission Residential College (Autonomous), Narendrapur. Most of my time goes into competitive programming on LeetCode and Codeforces, plus a little competitive data analysis on the side.",
    "I compete on Codeforces as a Newbie and spend a good deal of time on the other side of the table too — exploring Python in depth, touching some grass, and getting comfortable with deep learning.",
    "This is my portfolio, my dumb thoughts, and my learning on data structures, algorithms, and statistics stuff.",
  ],
};

export const pages: {
  path: string;
  label: string;
  description: string;
}[] = [
  { path: "/resume", label: "Résumé", description: "the traditional one-page view" },
  { path: "/education", label: "Education", description: "degree, grade card, curriculum" },
  { path: "/projects", label: "Projects", description: "full write-ups, one per project" },
  { path: "/skills", label: "Skills", description: "languages, libraries, concepts" },
  { path: "/positions", label: "Positions", description: "roles and responsibilities" },
  { path: "/achievements", label: "Achievements", description: "contests, hackathons, exams" },
  { path: "/gallery", label: "Gallery", description: "certificates and scorecards" },
  { path: "/codeforces", label: "Codeforces", description: "rating, activity, problem breakdown" },
  { path: "/github", label: "GitHub", description: "profile and recent commits" },
  { path: "/blogs", label: "Blog", description: "write-ups on what I'm building" },
];

export const education = {
  title: "Education",
  degrees: [
    {
      title: "B.Sc. Major",
      badge: "UNDERGRADUATE · ONGOING",
      institution: "Ramakrishna Mission Residential College (Autonomous), Narendrapur",
      score: "9.45",
      scoreLabel: "SCORE",
      scoreSuffix: "(Current)",
      year: "2025–Present",
      yearLabel: "YEAR",
      description:
        "Four-year Bachelor of Science in Statistics. First year core spans Probability Theory, Combinatorics, Case Study, Model Fitting With Discrete Random Variable, Measure Theory, Complex Number Analysis, alongside the programming and data structure in C, analytical and data handling with Python.",
      courses: [],
    },
    {
      title: "B.Sc. Minor (Computer Science)",
      badge: "MINOR · ONGOING",
      institution: "Ramakrishna Mission Residential College (Autonomous), Narendrapur",
      score: "9.50",
      scoreLabel: "SCORE",
      scoreSuffix: "(Current)",
      year: "2026–Present",
      yearLabel: "YEAR",
      description:
        "An additional structured stream in Computer Science taken on top of the Statistics major, deeping the analysis, data structure, C programming, CP, DBMS, ORACLE, MSSQL-SSMS, machine learning and Financial Workflow.",
      courses: [
        { code: "MIN01C22", course: "C PROG.", session: "JAN–MAY, 2026", gr: "AA" },
      ],
    },
    {
      title: "Senior Secondary",
      badge: "CLASS XII · COMPLETED",
      institution: "WBCHSE Board",
      score: "95.40%",
      scoreLabel: "SCORE",
      scoreSuffix: "",
      year: "2025",
      yearLabel: "YEAR",
      description:
        "West Bengal Council of Higher Secondary Education (WBCHSE), Science stream. Scored 95.40%.",
      courses: [],
    },
  ],
  courses: [
    { code: "PY-101", name: "Python Programming", platform: "Udemy", session: "2025" },
    { code: "SQL-201", name: "MSSQL", platform: "Coursera", session: "2025" },
    { code: "CPP-101", name: "C++ Programming", platform: "Udemy", session: "2025" },
  ],
  gradeCard: {
    name: "Arpan Mukherjee",
    rollNo: "2R26STSA2026",
    discipline: "Statistics",
    admission: "July 2025",
    division: "Department of Statistics",
    minDuration: "6 Semesters / 3 Years",
    semesters: [
      {
        title: "Sem I — Monsoon Semester of AY 2025-26",
        rows: [
          { code: "1STAUMA01N40", course: "Probability Theory I & Real Analysis I", cr: 4, gr: "A+" },
          { code: "1STAUMA02C22", course: "Descriptive Statistics I with Practical Analysis", cr: 4, gr: "O" },
          { code: "1MATUMIN01N40", course: "Classical Algebra, Modern Algebra, Differential Equations", cr: 4, gr: "O" },
          { code: "1ENVUIDC01N30", course: "Environmental Studies", cr: 3, gr: "O" },
          { code: "1LTXUSEC01L03", course: "Introduction to R and LaTeX", cr: 3, gr: "O" },
          { code: "1ENGUAEC01N20", course: "Modern Indian Language: English - I", cr: 2, gr: "A+" },
          { code: "1INCUVAC01N30", course: "Indian Culture - I", cr: 3, gr: "A+" },
        ],
        totalCredits: 23,
        spi: "9.61",
      },
      {
        title: "Sem II — Winter Semester of AY 2025-26",
        rows: [
          { code: "2STAUMA03N40", course: "Probability Theory II and Real Analysis II", cr: 4, gr: "O" },
          { code: "2STAUMA04C22", course: "Descriptive Statistics II with Practical Analysis and Probability Theory II", cr: 4, gr: "O" },
          { code: "2COMUMIN01C22", course: "Problem Solving Using Computer", cr: 4, gr: "A+" },
          { code: "2ENVUIDC02N30", course: "Environmental Education", cr: 3, gr: "A+" },
          { code: "2BPPUSEC02L03", course: "Python Programming", cr: 3, gr: "O" },
          { code: "2ENGUAEC02N20", course: "Ability Enhancement Course: English II", cr: 2, gr: "A+" },
          { code: "2INCUVAC02N30", course: "Indian Culture II", cr: 3, gr: "B+" },
        ],
        totalCredits: 23,
        spi: "9.30",
      },
    ],
    summary: {
      header: ["Sem I", "Sem II", "Status"],
      rows: [
        { label: "S.P.I", values: ["9.61", "9.30", "Incomplete"] },
        { label: "C.P.I", values: ["9.61", "9.46", ""] },
      ],
    },
    gradePoints: [
      { grade: "O", points: 10 },
      { grade: "A+", points: 9 },
      { grade: "A", points: 8 },
      { grade: "B+", points: 7 },
      { grade: "B", points: 6 },
      { grade: "C", points: 5 },
      { grade: "P", points: 4 },
      { grade: "F", points: 0 },
    ],
  },
};

export const projects = {
  title: "Projects",
  items: [
    {
      number: "01",
      title: "ARTHASETU 2.0 — Financial Inclusion Platform",
      period: "Aug 2026 – Present",
      association: "BUILD BANK 2026, IIT Delhi",
      tags: ["Python", "XGBoost", "Random Forest", "K-Means", "ZKP", "FHE", "PQC"],
      paragraphs: [
        "ARTHASETU 2.0 is an adaptive **financial inclusion platform** built for BUILD BANK 2026 (Track 1: Financial Inclusion for the Underbanked). India has over *300 million credit-invisible gig workers* — street vendors, domestic workers, delivery riders — who lack traditional credit histories despite having verifiable trust signals like rental payments, medical expenses, and bill payment histories. This project set out to bridge that gap by creating a system that could assess creditworthiness using alternative data, while simultaneously being accessible enough for first-time financial users who may never have interacted with a banking app before.",
        "At the core of the platform is a **statistical user-profiling engine** that dynamically adapts the interface, guidance, and pacing for each user. Using *K-Means clustering*, the system segments users into behavioral cohorts and adjusts the onboarding flow accordingly — simpler language and larger buttons for first-time users, more advanced options for digitally literate ones. The credit scoring model combines **XGBoost** (achieving *99.5% AUC-ROC*) with Random Forest for ensemble predictions, trained on a synthetic dataset that mimics real-world gig worker financial patterns. Feature engineering included payment regularity scores, expense volatility indices, and social trust signals derived from peer references.",
        "Security was a first-class concern, not an afterthought. The platform implements a **10-layer post-quantum security stack**: *Zero-Knowledge Proofs (ZKP)* allow users to prove creditworthiness without revealing raw financial data, *Fully Homomorphic Encryption (FHE)* enables computation on encrypted data so the server never sees plaintext, and *Post-Quantum Cryptography (PQC)* algorithms like CRYSTALS-Kyber and CRYSTALS-Dilithium protect against future quantum computing threats. This ensures that even if an adversary records encrypted traffic today, they cannot decrypt it once quantum computers become practical.",
        "The project was built as a proof-of-concept for the hackathon but is designed with production in mind. The architecture separates the ML inference layer from the security layer, allowing either to be upgraded independently. Future work includes integrating with actual **UPI transaction APIs**, deploying the model on edge devices for offline scoring in rural areas, and adding multi-language support for Hindi, Bengali, and Tamil interfaces.",
      ],
      highlights: [
        "Statistical user-profiling engine that dynamically adapts interface, guidance, and pacing for first-time financial users.",
        "Machine-learning credit scoring using XGBoost (99.5% AUC-ROC) and Random Forest.",
        "10-layer post-quantum security stack including Zero-Knowledge Proofs (ZKP), Fully Homomorphic Encryption (FHE), and Post-Quantum Cryptography (PQC).",
      ],
      links: [{ label: "GitHub →", url: "https://github.com/Apumukherjee819" }],
    },
    {
      number: "02",
      title: "Flood Evacuation using PSO + Flood Prediction with Random Forest",
      period: "2026",
      association: "IDEAS TIH, Indian Statistical Institute, Kolkata",
      tags: ["Python", "Random Forest", "Particle Swarm Optimization", "Geospatial Analysis"],
      paragraphs: [
        "This project tackles two interconnected problems in disaster management: **predicting where floods will occur** and *optimizing evacuation routes* when they do. India is one of the most flood-prone countries in the world, with recurring monsoon disasters affecting millions across Assam, Bihar, West Bengal, and Kerala every year. The goal was to build a national-scale model that could both predict flood risk at a granular level and compute optimal evacuation strategies in real-time, covering India's complete geographic extent from *8°N to 37°N latitude* and *68°E to 97°E longitude*.",
        "The prediction component uses a **Random Forest classifier** trained on *10,000 geospatial observations* incorporating rainfall intensity, river discharge rates, elevation data from SRTM DEM, water levels, soil moisture, and population density. The dataset was validated against *5,057 historical flood occurrences* sourced from the India Meteorological Department and Central Water Commission. Feature selection was done using correlation analysis and SHAP values to identify the most predictive variables. The model achieved **96.7% AUC-ROC**, with the stratification division of 10.84% high-risk, 77.13% moderate-risk, and 12.03% low-risk zones — a distribution that aligns with real-world observations.",
        "For evacuation planning, the project implements **Particle Swarm Optimization (PSO)** — a metaheuristic algorithm inspired by the social behavior of bird flocking. The PSO treats each evacuation route as a particle in a swarm, iteratively improving routes by balancing distance, road capacity, flood severity along the path, and vehicle availability. The fitness function incorporates real-time flood depth projections and road inundation maps. Over 200 iterations with a swarm size of 50, the algorithm converged on routes that reduced evacuation time by **33%** compared to traditional shortest-path algorithms, which fail to account for dynamic flood conditions.",
        "The entire pipeline is built in Python using **GeoPandas** for spatial operations, **Scikit-learn** for the classifier, and a custom PSO implementation optimized with NumPy vectorization. Results are visualized on interactive **Folium maps** that show risk zones, evacuation corridors, and shelter locations. The model is designed to be extensible — integrating live satellite imagery from *Sentinel-1 SAR* and real-time river gauge data from CWC could enable actual early-warning capabilities. Future work includes coupling the model with drone-based survey data for even finer resolution in urban flood-prone areas.",
      ],
      highlights: [
        "Random Forest classifier achieved 96.7% AUC-ROC.",
        "Stratification division: 10.84% + 77.13% + 12.03%.",
        "Particle Swarm Optimization reduced evacuation time by 33%.",
      ],
      links: [{ label: "GitHub →", url: "https://github.com/Apumukherjee819" }],
    },
  ],
};

export const skills = {
  title: "Skills",
  categories: [
    {
      name: "Languages",
      items: ["Python", "C++", "SQL", "R"],
    },
    {
      name: "Libraries & Frameworks",
      items: ["NumPy", "Pandas", "Scikit-learn", "XGBoost", "TensorFlow", "PyTorch", "FastAPI", "Streamlit"],
    },
    {
      name: "Concepts",
      items: [
        "Data Structures",
        "Algorithms",
        "Statistical Inference",
        "Machine Learning",
        "Deep Learning",
        "Geospatial Analysis",
        "Competitive Programming",
      ],
    },
    {
      name: "Tools",
      items: ["Git", "GitHub", "Jupyter", "VS Code", "MSSQL", "LaTeX"],
    },
  ],
};

export const positions = {
  title: "Positions of Responsibility",
  items: [
    {
      role: "Member of Student Council (Vidyarthi Sabha), Core Committee (Library Section)",
      organization: "Ramakrishna Mission Residential College (Autonomous), Narendrapur",
      period: "2025 – Present",
      description:
        "Active member of the Vidyarthi Sabha Core Committee, overseeing library section governance, student academic resources, and co-organizing departmental statistical workshops and seminars.",
    },
    {
      role: "E-Student Member",
      organization: "Royal Statistical Society (RSS), United Kingdom",
      period: "2026 – Present",
      description:
        "International student member participating in international statistical conventions, research publications, data science discussion tracks, and methodology updates.",
    },
  ],
};

export const achievements = {
  title: "Achievements & Honors",
  items: [
    {
      number: "01",
      title: "BUILD BANK 2026, IIT Delhi — Project Lead & Contender",
      date: "Aug 2026",
      tags: ["FinTech", "Machine Learning", "Post-Quantum Cryptography"],
      description:
        "Built ARTHASETU 2.0, an adaptive financial inclusion platform for 300M+ underbanked gig workers, achieving 99.5% AUC-ROC with XGBoost credit scoring, K-Means cohort segmentation, and a 10-layer post-quantum security stack (ZKP, FHE, CRYSTALS-Kyber/Dilithium).",
      verifyUrl: "/projects",
    },
    {
      number: "02",
      title: "IDEAS TIH, Indian Statistical Institute (ISI) Kolkata — Research Project & Internship",
      date: "May 2026",
      tags: ["Geospatial", "Random Forest", "Particle Swarm Optimization"],
      description:
        "Developed a national-scale flood prediction and evacuation optimization model covering 8°N–37°N across India. Achieved 96.7% AUC-ROC on 10,000 observations validated against 5,057 historical flood events, with a 33% reduction in multi-agent evacuation time using PSO.",
      verifyUrl: "/gallery",
    },
    {
      number: "03",
      title: "LeetCode Algorithmic Benchmark & 50-Day Consistency Badge",
      date: "2026",
      tags: ["Algorithms", "Data Structures", "Dynamic Programming", "Python"],
      description:
        "Solved 300+ algorithmic problems across Data Structures, Dynamic Programming, Graphs, and Advanced Database Queries (Over 100+ SQL/Database problems solved). Global rank 476,886.",
      verifyUrl: "https://leetcode.com/u/apumukherjee819/",
    },
    {
      number: "04",
      title: "SQLPad Problem Solving Benchmark — 100+ Advanced Queries",
      date: "2026",
      tags: ["SQL", "Relational Database", "Query Optimization"],
      description:
        "Completed 100+ complex relational database, window functions, and analytics query challenges on SQLPad.",
      verifyUrl: "",
    },
    {
      number: "05",
      title: "DataLemur Data Science & SQL Interview Milestone — 150+ Questions",
      date: "2026",
      tags: ["Data Science", "SQL", "Probability", "Statistics"],
      description:
        "Solved 150+ data science and database interview challenges covering distribution testing, data manipulation, and high-performance SQL schemas.",
      verifyUrl: "",
    },
  ],
};

export const gallery = {
  title: "Gallery",
  description: "Certificates, scorecards, and reports.",
  items: [
    {
      title: "FLOOD EVACUATION MODEL USING PSO ALGORITHM AND FLOOD PREDICTION USING RANDOM FOREST",
      year: "2026",
      type: "pdf",
      url: "/FINAL REPORT.pdf",
    },
    {
      title: "MSSQL CERTIFICATE",
      year: "2025",
      type: "image",
      url: "/MSSQL CERTIFICATE.png",
    },
    {
      title: "R PROGRAMMING CERTIFICATE",
      year: "2025",
      type: "pdf",
      url: "/R PROGRAMMING CERTIFICATE.pdf",
    },
    {
      title: "IDEAS TIH INTERNSHIP, ISI, KOLKATA",
      year: "2026",
      type: "pdf",
      url: "/IDEAS TIH INTERNSHIP ISI KOLKATA.pdf",
    },
  ],
};

export const codeforces = {
  title: "Codeforces",
  description: "Live competitive programming profile — rating, activity, and problem-solving breakdown.",
  profileUrl: site.socials.codeforces.url,
  handle: site.socials.codeforces.handle,
};

export const github = {
  title: "GitHub",
  description: "Public profile and recent commit activity.",
  profileUrl: site.socials.github.url,
  handle: site.socials.github.handle,
  avatar: "https://avatars.githubusercontent.com/u/194593063",
  bio: "B.Sc. Statistics student at RKMRC Narendrapur. Competitive programmer, ML enthusiast, building tools for financial inclusion and flood prediction.",
  location: "Kolkata, India",
  stats: {
    repos: 12,
    followers: 8,
    following: 15,
  },
  recentCommits: [
    {
      message: "Add ARTHASETU 2.0 financial inclusion platform with XGBoost scoring",
      repo: "Apumukherjee819/arthasetu-2.0",
      date: "2 days ago",
    },
    {
      message: "Implement flood evacuation model using PSO algorithm",
      repo: "Apumukherjee819/flood-evacuation",
      date: "1 week ago",
    },
    {
      message: "Add Random Forest classifier for flood prediction with 96.7% AUC-ROC",
      repo: "Apumukherjee819/flood-evacuation",
      date: "1 week ago",
    },
    {
      message: "Update README with project documentation and setup instructions",
      repo: "Apumukherjee819/arthasetu-2.0",
      date: "2 weeks ago",
    },
    {
      message: "Add geospatial analysis pipeline for India-wide flood risk mapping",
      repo: "Apumukherjee819/flood-evacuation",
      date: "3 weeks ago",
    },
  ],
};

export const blogs = {
  title: "Blog",
  description: "Notes on competitive programming, statistics, and the projects I'm building.",
  posts: [
    {
      slug: "leetcode-journey",
      title: "My LeetCode Journey",
      date: "2026",
      readTime: "5 min read",
      excerpt: "Tracking my progress through LeetCode contests and problem-solving patterns.",
      tags: ["Competitive Programming", "Python", "Algorithms"],
      cover: "",
      url: site.socials.leetcode.url,
    },
  ],
  externalUrl: site.socials.leetcode.url,
};

export const resume = {
  title: "Résumé",
  subtitle: "Bachelor (Hons.) in Statistics",
  institution: "Ramakrishna Mission Residential College (Autonomous), Narendrapur",
  summary: "",
  contact: {
    phone: "+91-7439766325",
    email: "arpanmukherjee0710@gmail.com",
    leetcode: "https://leetcode.com/u/apumukherjee819/",
    github: "https://github.com/Apumukherjee819",
    linkedin: "https://in.linkedin.com/in/arpan-mukherjee-560b61375",
  },
  education: [
    { year: "2025-2029", degree: "B.Sc. in Statistics", institute: "Ramakrishna Mission Residential College Autonomous", score: "9.30", scoreLabel: "CGPA" },
    { year: "2025", degree: "WBHSE (XII)", institute: "Ramakrishna Mission Vidyalaya Narendrapur", score: "95.4%", scoreLabel: "Percentage" },
    { year: "2023", degree: "WBSE (X)", institute: "Mahesh Sri Ramakrishna Ashram", score: "94.42%", scoreLabel: "Percentage" },
  ],
  projects: [
    {
      title: "BUILD BANK, IIT DELHI",
      period: "Aug 2026 – ongoing",
      association: "Underbanked and Financial Inclusion, Giving Onboarding Trust For Gig Workers (ARTHASETU 2.0)",
      github: "https://github.com/Apumukherjee819",
      metrics: "AUC-ROC : 99.5%, XGBoost, Random Forest, K-mean Clustering, Security -7 layers (Highest Level), ZKP, FHE, PQC",
      description:
        "ARTHASETU 2.0 is an adaptive financial inclusion platform built for the BUILD BANK 2026, IIT DELHI (Track 1: Financial Inclusion for the Underbanked). It addresses the challenge of 300+ million credit-invisible gig workers in India who lack traditional credit histories — despite having verifiable trust signals like rental payments, medical expenses, and bill payment histories. The platform uses a statistical user-profiling engine that dynamically adapts interface, guidance, and pacing for first-time financial users. It combines machine learning (XGBoost, 99.5% accuracy) with 10-layer post-quantum security (ZKP, FHE, PQC) to build trust while protecting user data.",
    },
    {
      title: "Flood Evacuation Using the PSO Algorithm And Flood Prediction With Random Forest Classifier",
      period: "May 2026 – ongoing",
      association: "IDEAS TIH ISI, Indian Statistical Institute, Kolkata",
      github: "https://github.com/Apumukherjee819",
      metrics: "AUC-ROC : 96.7%, Stratification Division : (10.84% + 77.13% + 12.03%), Reduction Of Evacuation Time : 33%",
      description:
        "The analysis encompasses 10,000 geo-spatial observations across India's complete geographic extent (8°N to 37°N latitude, 68°E to 97°E longitude). A multi-factor flood risk model incorporating rainfall intensity, river discharge, elevation, water levels, and population density was developed and achieved 96.7% accuracy when validated against 5,057 historical flood occurrences.",
    },
  ],
  technicalSkills: {
    languages: "C, C++, Python, MSSQL, R",
    toolsAndFrameworks: "Dev C++, Codelite, Visual Studio, Google Collab, Kaggle, SQL Server Management Studio, Microsoft Visio, Congos, Power BI",
    librariesAndPackages: "Matplotlib, Pandas, Numpy, Seaborn, Scipy, SQLAlchemy, Statmodels, XGBoost, Plotly, restAPI, Flask, Django, Streamlit",
    operatingSystems: "Windows & Android",
  },
  keyCourses:
    "Statistics & Computer Science: Introduction to C, Fundamentals of Computers, Object Oriented Paradigm in C++, Data Structures and Algorithms, Python Programming, Operating System, Database Management System, Statistical Methods, Distribution Fitting, Data Modelling, Data Analysis, Discrete Mathematics, Numerical Methods, Computer Networks",
  positions: [
    {
      role: "Member Of Student Council (Vidyarthi Sabha), Vidyarthi Sabha Core Committee, Library Section",
      institution: "Ramakrishna Mission Residential College (Autonomous)",
      period: "2025 – 2026",
    },
    {
      role: "E-Student Membership",
      institution: "Royal Statistical Society, UK",
      period: "2026 – present",
    },
  ],
  achievements: [
    "Leetcode Rank 4,76,886 [Over 300+ Question Solved at LeetCode, Achieve the 50 day badge], Over 100 Database problem Solver 2026",
    "Problem Solver on the SQLPad Platform, 100+ Question Solved on the Platform SQLPad, 2026",
    "Problem Solver in DataLemur (150+ database Interview Question Solved), Over 100 Database problem Solved 2026",
  ],
};
