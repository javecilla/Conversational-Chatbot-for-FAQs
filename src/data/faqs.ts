// /src/data/faqs.ts
import type { FAQ } from "@/types/faqs";

export const faqs: FAQ[] = [
  // Services Related
  {
    id: 1,
    question: "What services do you offer?",
    answer: "I provide comprehensive web development solutions including frontend development with Vue.js and TypeScript, backend development with Laravel, database design with MySQL and PostgreSQL, API development, and cloud deployment on platforms like Vercel and Hostinger. I specialize in building responsive, performant, and scalable web applications tailored to client needs.",
    keywords: ["services", "offerings", "web development", "skills", "expertise"],
  },
  {
    id: 2,
    question: "Do you accept project commissions?",
    answer: "Yes, I’m open to project commissions! I work with clients on a project-by-project basis to deliver custom web solutions. Whether it’s a small site or a large-scale application, feel free to reach out to discuss your requirements and get a personalized quote.",
    keywords: ["commissions", "projects", "hire", "work", "freelance"],
  },
  {
    id: 3,
    question: "How much would it cost to hire you for a project?",
    answer: "The cost depends on the project’s scope, complexity, and timeline. I offer competitive pricing and work closely with clients to ensure high-quality solutions fit their budget. Contact me for a detailed quote based on your needs!",
    keywords: ["cost", "price", "hire", "budget", "quote"],
  },
  {
    id: 4,
    question: "Do you provide maintenance and support after project completion?",
    answer: "Absolutely! I offer post-launch support and maintenance packages, including bug fixes, performance optimization, security updates, and feature enhancements. We can tailor the terms to suit your project’s requirements.",
    keywords: ["maintenance", "support", "after", "post-launch", "upkeep"],
  },
  {
    id: 5,
    question: "How do you handle project communication and updates?",
    answer: "I keep communication clear and consistent using your preferred channel—email, Slack, Teams, etc. Expect weekly progress reports, sprint reviews when needed, and detailed documentation to keep you in the loop throughout the process.",
    keywords: ["communication", "updates", "progress", "collaboration", "contact"],
  },
  {
    id: 6,
    question: "How do you handle project deadlines and timelines?",
    answer: "I prioritize deadlines by setting realistic milestones with clients. Through regular updates and proactive collaboration, I ensure projects stay on track and are delivered on time without compromising quality.",
    keywords: ["deadlines", "timelines", "schedule", "delivery", "time"],
  },

  // About Me FAQs
  {
    id: 7,
    question: "Who are you?",
    answer: "I’m Jerome Avecilla, a 20-year-old BSIT student and aspiring full-stack web developer. I’m passionate about crafting user-friendly, high-performance web applications using modern tech like Vue.js, TypeScript, and Laravel. Beyond coding, I’m a basketball fan, swimmer, hiker, and avid gamer—catch me playing Valorant or Wild Rift!",
    keywords: ["who", "Jerome", "about", "introduction", "me"],
  },
  {
    id: 8,
    question: "What’s your background?",
    answer: "I’m currently pursuing a Bachelor of Science in Information Technology (specializing in Web Development) at Bulacan State University since July 2023. Before that, I completed my Senior High School at Golden Minds Colleges (2021-2023) with a focus on ICT, where I built a strong foundation in programming and web development.",
    keywords: ["background", "history", "education", "experience", "past"],
  },
  {
    id: 9,
    question: "What experience do you have?",
    answer: "Since May 2022, I’ve been an IT Assistant at Golden Minds Colleges, starting with UI/UX improvements and growing into backend development and system maintenance. I’ve worked on projects like the college’s official website and an online voting system, blending technical skills with real-world impact.",
    keywords: ["experience", "work", "job", "projects", "skills"],
  },

  // Skills and Tech Stack FAQs
  {
    id: 10,
    question: "What skills do you have?",
    answer: "I’m skilled in frontend development (HTML, CSS, JavaScript, Vue.js, TypeScript, Tailwind CSS, Bootstrap, jQuery), backend development (PHP, Laravel), and database management (MySQL, PostgreSQL). I also handle CI/CD with Git, GitLab, and GitHub Actions, plus deployment on platforms like Vercel and Hostgator.",
    keywords: ["skills", "abilities", "expertise", "tech", "knowledge"],
  },
  {
    id: 11,
    question: "What technologies do you use?",
    answer: "My go-to tech stack includes Vue.js and TypeScript for frontend, Laravel for backend, Tailwind CSS for styling, and Vite for fast builds. I use PostgreSQL and MySQL for databases, and leverage tools like Git, GitHub Actions, and Vercel for version control and deployment.",
    keywords: ["technologies", "tech stack", "tools", "frameworks", "software", "typescript", "vue.js", "laravel"],
  },
  {
    id: 12,
    question: "What’s your favorite framework?",
    answer: "I love working with Vue.js—it’s intuitive, flexible, and pairs perfectly with TypeScript for building robust frontend applications. On the backend, Laravel’s elegance and powerful features make it a close second!",
    keywords: ["favorite", "framework", "preference", "Vue.js", "Laravel"],
  },
  {
    id: 13,
    question: "Do you work with databases?",
    answer: "Yes, I’m experienced with MySQL and PostgreSQL. I design efficient database schemas, optimize queries, and integrate them seamlessly into web applications for reliable data management.",
    keywords: ["databases", "MySQL", "PostgreSQL", "data", "management"],
  },

  // Education and Achievements FAQs
  {
    id: 14,
    question: "What’s your education like?",
    answer: "I’m a BSIT student at Bulacan State University (since 2023), specializing in web development. I also graduated from Golden Minds Colleges’ ICT track in 2023, where I started mastering programming basics and built my first projects.",
    keywords: ["education", "study", "school", "degree", "learning"],
  },
  {
    id: 15,
    question: "Have you won any awards?",
    answer: "Yes! I was part of the Hackathon Champion team at BulSU’s 13th IT Congress (May 2023), building an eCommerce site under pressure. I also earned Best Capstone of the Year (April 2022) at Golden Minds for a Web-Based Inventory Management System.",
    keywords: ["awards", "achievements", "wins", "honors", "recognition", "certification", "cetificates"],
  },

  // Personal Interest FAQs
  {
    id: 16,
    question: "What do you do outside of coding?",
    answer: "When I’m not coding, I’m into basketball, swimming, and hiking. I’m also a big gamer—favorites include Valorant, League of Legends, Wild Rift, and Crossfire. I love traveling too, always planning my next adventure!",
    keywords: ["outside", "hobbies", "interests", "free time", "aside", "activities"],
  },
  {
    id: 17,
    question: "How can I connect with you?",
    answer: "Let’s link up! You can reach me via LinkedIn, Slack, Facebook, or X. Drop me a message about projects, collabs, or even a quick gaming session—I’m always up for a chat!",
    keywords: ["connect", "contact", "reach", "social", "message"],
  },

  // Project-Related FAQs
  {
    id: 18,
    question: "What projects have you worked on?",
    answer: "I’ve built the Golden Minds Colleges Official Website (Laravel, Vue.js), an Online Voting System (Laravel, jQuery), and a Ph-En Vocabulary Web App (PHP, JavaScript). Check my portfolio for more details!",
    keywords: ["projects", "portfolio", "work", "examples", "creations"],
  },
  {
    id: 19,
    question: "Can you help with my academic project?",
    answer: "Yes, I’ve worked on academic projects like voting systems and vocabulary apps. I can assist with web development tasks—reach out with your project details, and let’s see how I can help!",
    keywords: ["academic", "help", "project", "school", "support"],
  },
] as const;