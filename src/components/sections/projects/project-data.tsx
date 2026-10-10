export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  github: string;
  caseStudy: string;
  technologies: string[];
}

export const projects: Project[] = [

  {
    id: 1,
    title: "Lawyer Company",
    category: "Corporate Website",
    description:
      "A modern corporate website for a law firm featuring responsive design, service pages, consultation workflows, SEO optimization, and a polished user experience tailored for legal professionals.",
    image: "/projects/lawyer.webp",
    url: "https://lawyer-pi-three.vercel.app/",
    github: "https://github.com/abdul0325/lawyer",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
    ],
  },

  {
    id: 2,
    title: "Business Startup SA",
    category: "Business Platform",
    description:
      "A professional business platform designed to help entrepreneurs launch and manage businesses. Includes modern UI, scalable architecture, responsive layouts, and optimized performance.",
    image: "/projects/saudi.webp",
    url: "https://www.businessstartupsaudiarabia.com/",
    github: "https://github.com/abdul0325/Business-Platform",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
    ],
  },

  {
    id: 3,
    title: "Qatar Charity",
    category: "NGO Platform",
    description:
      "A charity management platform supporting donation campaigns, volunteer engagement, event promotion, and dynamic content management with an accessible and responsive user interface.",
    image: "/projects/charity.webp",
    url: "https://charity-blush-psi.vercel.app/",
    github: "https://github.com/abdul0325/charity",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Firebase",
    ],
  },

  {
    id: 4,
    title: "Foodymat Restaurant",
    category: "Restaurant Platform",
    description:
      "A responsive restaurant website featuring digital menus, online ordering, reservation workflows, and an engaging customer experience optimized for all screen sizes.",
    image: "/projects/food.webp",
    url: "https://restaurant-rho-ruddy.vercel.app/",
    github: "https://github.com/abdul0325/foodWebClone",
    caseStudy: "#",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
    ],
  },

  {
    id: 5,
    title: "Online Quran Institute",
    category: "Education Platform",
    description:
      "A scalable online learning platform providing Quran education with authentication, course management, responsive design, and an intuitive student experience.",
    image: "/projects/al-quran.webp",
    url: "https://online-quran-rho.vercel.app/",
    github: "https://github.com/abdul0325/Al-Quran",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Firebase",
    ],
  },

  {
    id: 6,
    title: "EmpowerZone",
    category: "Web3 Platform",
    description:
      "A blockchain-powered platform focused on token utilities, staking mechanisms, APY rewards, and decentralized user interactions with a modern frontend experience.",
    image: "/projects/empower.webp",
    url: "https://empowerzone.us/",
    github: "https://github.com/abdul0325/empower-zone",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "Solana",
      "Web3.js",
      "Tailwind CSS",
    ],
  },

  {
    id: 7,
    title: "Laundry Service Platform",
    category: "Service Marketplace",
    description:
      "A complete laundry service platform enabling customers to schedule pickups, manage orders, track services, and enjoy a seamless booking experience.",
    image: "/projects/laundary.webp",
    url: "https://lundary.vercel.app/",
    github: "https://github.com/abdul0325/Londary_service_project",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Node.js",
      "MongoDB",
    ],
  },
  {
    id: 8,
    title: "Prodexa",
    category: "Full Stack Platform",
    description:
      "A production-focused full stack application built with modern architecture, emphasizing maintainability, performance, authentication, and scalable backend services.",
    image: "/projects/prodexa.webp",
    url: "https://github.com/abdul0325/Prodexa",
    github: "https://github.com/abdul0325/Prodexa",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "Docker",
    ],
  },

  {
    id: 9,
    title: "E-Commerce Platform",
    category: "Online Store",
    description:
      "A complete e-commerce application featuring product catalog management, shopping cart functionality, secure checkout workflows, and responsive customer experiences.",
    image: "/projects/ecom.webp",
    url: "https://github.com/abdul0325/E-Commerce",
    github: "https://github.com/abdul0325/E-Commerce",
    caseStudy: "#",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe",
    ],
  },

  {
    id: 10,
    title: "Trip Planner",
    category: "Travel Platform",
    description:
      "A travel planning application that helps users organize itineraries, discover destinations, and manage trips through an intuitive and responsive interface.",
    image: "/projects/trip.webp",
    url: "https://github.com/abdul0325/Trip-Planner",
    github: "https://github.com/abdul0325/Trip-Planner",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Node.js",
    ],
  },

  {
    id: 11,
    title: "Portfolio Website",
    category: "Personal Brand",
    description:
      "A premium developer portfolio showcasing projects, technical expertise, animations, and modern UI/UX built with performance and accessibility in mind.",
    image: "/projects/portfolio.webp",
    url: "https://abdulrehman0325.vercel.app/",
    github: "https://github.com/abdul0325/Portfolio-Website",
    caseStudy: "#",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
  },

  {
    id: 12,
    title: "WhatsApp Clone",
    category: "Real-Time Application",
    description:
      "A real-time messaging application inspired by WhatsApp, featuring chat interfaces, authentication, responsive layouts, and modern frontend architecture.",
    image: "/projects/watsapp.webp",
    url: "https://github.com/abdul0325/WatsappClone",
    github: "https://github.com/abdul0325/WatsappClone",
    caseStudy: "#",
    technologies: [
      "React",
      "Firebase",
      "Tailwind CSS",
    ],
  },
];