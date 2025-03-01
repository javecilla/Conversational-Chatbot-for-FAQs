import type { FAQ } from "@/types/faqs";

export const faqs: FAQ[] = [
  // Services Related
  {
    id: 1,
    question: "What services do you offer?",
    answer: "I provide the following **web development solutions**:\n- **Frontend development** with **Vue.js** and **TypeScript**\n- **Backend development** with **Laravel**\n- **Database design** with **MySQL** and **PostgreSQL**\n- **API development**\n- **Cloud deployment** on **Vercel** and **Hostinger**\nI specialize in building responsive, performant, and scalable web applications tailored to client needs.",
    keywords: ["services", "offerings", "web development", "skills", "expertise"],
    patternSuggestions: [2, 3, 10],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Services",
  },
  {
    id: 2,
    question: "Do you accept project commissions?",
    answer: "Yes, I’m open to project commissions! I work with clients on a project-by-project basis to deliver custom web solutions. Whether it’s a small site or a large-scale application, feel free to reach out to discuss your requirements and get a personalized quote.",
    keywords: ["commissions", "projects", "hire", "work", "freelance"],
    patternSuggestions: [3, 5, 6],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Services",
  },
  {
    id: 3,
    question: "How much would it cost to hire you for a project?",
    answer: "The cost depends on the project’s scope, complexity, and timeline. I offer competitive pricing and work closely with clients to ensure high-quality solutions fit their budget. Contact me for a detailed quote based on your needs!",
    keywords: ["cost", "price", "hire", "budget", "quote"],
    patternSuggestions: [2, 5, 6],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Pricing",
  },
  {
    id: 4,
    question: "Do you provide maintenance and support after project completion?",
    answer: "Absolutely! I offer post-launch support and maintenance packages, including:\n- Bug fixes\n- Performance optimization\n- Security updates\n- Feature enhancements\nWe can tailor the terms to suit your project’s requirements.",
    keywords: ["maintenance", "support", "after", "post-launch", "upkeep"],
    patternSuggestions: [5, 6, 18],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Services",
  },
  {
    id: 5,
    question: "How do you handle project communication and updates?",
    answer: "I keep communication clear and consistent using your preferred channel—email, Slack, Teams, etc. Expect:\n1. Weekly progress reports\n2. Sprint reviews when needed\n3. Detailed documentation to keep you in the loop throughout the process.",
    keywords: ["communication", "updates", "progress", "collaboration", "contact"],
    formatSuggestion: ["numbered", "list"], // Numbered list due to \n1.
    category: "Work Preferences",
  },
  {
    id: 6,
    question: "How do you handle project deadlines and timelines?",
    answer: "I prioritize deadlines by setting realistic milestones with clients. Through regular updates and proactive collaboration, I ensure projects stay on track and are delivered on time without compromising quality.",
    keywords: ["deadlines", "timelines", "schedule", "delivery", "time"],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Work Preferences",
  },

  // About Me FAQs
  {
    id: 7,
    question: "Who are you?",
    answer: "I’m Jerome Avecilla, a 20-year-old BSIT student and aspiring full-stack web developer. I’m passionate about crafting user-friendly, high-performance web applications using modern tech like Vue.js, TypeScript, and Laravel. Beyond coding, I’m a basketball fan, swimmer, hiker, and avid gamer—catch me playing Valorant or Wild Rift!",
    keywords: ["who", "Jerome", "about", "introduction", "me"],
    patternSuggestions: [8, 9, 16],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "About Me",
  },
  {
    id: 8,
    question: "What’s your background?",
    answer: "I’m currently pursuing a Bachelor of Science in Information Technology (specializing in Web Development) at Bulacan State University since July 2023. Before that, I completed my Senior High School at Golden Minds Colleges (2021-2023) with a focus on ICT, where I built a strong foundation in programming and web development.",
    keywords: ["background", "history", "education", "experience", "past"],
    patternSuggestions: [14, 15, 9],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Background",
  },
  {
    id: 9,
    question: "What experience do you have?",
    answer: "Since May 2022, I’ve been an IT Assistant at Golden Minds Colleges, starting with UI/UX improvements and growing into backend development and system maintenance. My key experiences include:\n- Working on the college’s official website\n- Developing an online voting system\nThese projects blend technical skills with real-world impact.",
    keywords: ["experience", "work", "job", "projects", "skills"],
    patternSuggestions: [10, 18, 11],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Background",
  },

  // Skills and Tech Stack FAQs
  {
    id: 10,
    question: "What skills do you have?",
    answer: "I'm skilled in the following areas:\n- **Frontend development** (**HTML**, **CSS**, **JavaScript**, **Vue.js**, **TypeScript**, **Tailwind CSS**, **Bootstrap**, **jQuery**)\n- **Backend development** (**PHP**, **Laravel**)\n- **Database management** (**MySQL**, **PostgreSQL**)\n- **CI/CD** with **Git**, **GitLab**, and **GitHub Actions**\n- **Deployment** on **Vercel** and **Hostgator**",
    keywords: ["skills", "abilities", "expertise", "tech", "knowledge"],
    patternSuggestions: [11, 12, 13],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 11,
    question: "What technologies do you use?",
    answer: "My go-to tech stack includes:\n- Vue.js and TypeScript for frontend\n- Laravel for backend\n- Tailwind CSS for styling\n- Vite for fast builds\n- PostgreSQL and MySQL for databases\n- Git, GitHub Actions, and Vercel for version control and deployment",
    keywords: ["technologies", "tech stack", "tools", "frameworks", "software", "typescript", "vue.js", "laravel"],
    patternSuggestions: [12, 13, 10],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 12,
    question: "What’s your favorite framework?",
    answer: "I love working with Vue.js—it’s intuitive, flexible, and pairs perfectly with TypeScript for building robust frontend applications. On the backend, Laravel’s elegance and powerful features make it a close second!",
    keywords: ["favorite", "framework", "preference", "Vue.js", "Laravel"],
    patternSuggestions: [10, 11, 13],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Skills",
  },
  {
    id: 13,
    question: "Do you work with databases?",
    answer: "Yes, I’m experienced with MySQL and PostgreSQL. I design efficient database schemas, optimize queries, and integrate them seamlessly into web applications for reliable data management.",
    keywords: ["databases", "MySQL", "PostgreSQL", "data", "management"],
    patternSuggestions: [10, 11, 12],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Skills",
  },

  // Education and Achievements FAQs
  {
    id: 14,
    question: "What’s your education like?",
    answer: "I’m a BSIT student at Bulacan State University (since 2023), specializing in web development. I also graduated from Golden Minds Colleges’ ICT track in 2023, where I started mastering programming basics and built my first projects.",
    keywords: ["education", "study", "school", "degree", "learning"],
    patternSuggestions: [15, 19, 8],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Background",
  },
  {
    id: 15,
    question: "Have you won any awards?",
    answer: "Yes! My achievements include:\n- Hackathon Champion at BulSU’s 13th IT Congress (May 2023) for an eCommerce site\n- Best Capstone of the Year (April 2022) at Golden Minds for a Web-Based Inventory Management System",
    keywords: ["awards", "achievements", "wins", "honors", "recognition", "certification", "cetificates"],
    patternSuggestions: [14, 9, 19],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Achievements",
  },

  // Personal Interest FAQs
  {
    id: 16,
    question: "What do you do outside of coding?",
    answer: "When I’m not coding, I enjoy:\n- Basketball\n- Swimming\n- Hiking\nI’m also a big gamer—favorites include Valorant, League of Legends, Wild Rift, and Crossfire. I love traveling too, always planning my next adventure!",
    keywords: ["outside", "hobbies", "interests", "free time", "aside", "activities"],
    patternSuggestions: [17, 7, 8],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Interests",
  },
  {
    id: 17,
    question: "How can I connect with you?",
    answer: "Let’s link up! You can reach me via:\n- LinkedIn\n- Slack\n- Facebook\n- X\nDrop me a message about projects, collabs, or even a quick gaming session—I’m always up for a chat!",
    keywords: ["connect", "contact", "reach", "social", "message"],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Contact",
  },

  // Project-Related FAQs
  {
    id: 18,
    question: "What projects have you done?",
    answer: "I've worked on several **key projects**. Here's the list:\n- **Golden Minds Colleges Official Website** (built with **Laravel**, **Vue.js** and **Bootstrap**)\n- **Online Voting System** (using **Laravel**, **jQuery** and **Bootstrap**)\n- **Personal Website Portfolio** (built with **Vue.js**, **TypeScript** and **Tailwind**)\n- **Ph`En Vocabulary Web App** (developed with **PHP** and **JavaScript**)\n- **Inventory Management System** (using **PHP**, **jQuery** and **Bootstrap**)\nYou can find more details in my portfolio!",
    keywords: ["projects", "portfolio", "work", "examples", "creations"],
    patternSuggestions: [19, 4, 5],
    formatSuggestion: ["bullet", "list"], // Explicitly define as bullet list
    category: "Services",
  },
  {
    id: 19,
    question: "Can you help with my academic project?",
    answer: "Yes, I’ve worked on academic projects like voting systems and vocabulary apps. I can assist with web development tasks—reach out with your project details, and let’s see how I can help!",
    keywords: ["academic", "help", "project", "school", "support"],
    patternSuggestions: [3, 5, 17],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Services",
  },
  // New added
  {
    id: 20,
    question: "Where are you located?",
    answer: "I'm currently based in the Philippines, living and studying in Bulacan.",
    keywords: ["location", "contact", "address"],
    patternSuggestions: [17, 21, 3],
    formatSuggestion: ["paragraph", "sentence"], // Explicitly define as paragraph
    category: "Contact",
  },
  {
    id: 21,
    question: "What mode of work do you prefer?",
    answer: "I prefer working remotely, but I'm open to on-site work as well.",
    keywords: ["mode", "work", "remote", "onsite"],
    patternSuggestions: [20, 6, 5],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Work Preferences",
  },

  // New FAQs for Web Development and Software Engineering Interviews
  {
    id: 22,
    question: "How do you plan or develop a project?",
    answer: "I follow the **Software Development Life Cycle (SDLC)** tailored to my workflow. The steps are:\n1. **Requirement analysis** to understand client needs\n2. **Designing** with wireframes and architecture (**Vue.js** for frontend, **Laravel** for backend)\n3. **Coding** using best practices\n4. **Testing** with **Jest** and manual checks\n5. **Deploying** on **Vercel** or **Hostinger**, ensuring scalability\nRegular client updates keep the process collaborative.",
    keywords: ["plan", "develop", "project", "SDLC", "development", "process", "workflow"],
    patternSuggestions: [5, 6, 18],
    formatSuggestion: ["numbered", "list"], // Explicitly define as numbered list
    category: "Work Preferences",
  },
  {
    id: 23,
    question: "What is REST API?",
    answer: "A **REST API** is a set of rules for building web services that allow systems to communicate over **HTTP**. I've implemented **RESTful APIs** using **Laravel**, following principles like **statelessness** and **resource-based endpoints**, to connect my frontend (**Vue.js**) with backend databases (**MySQL**, **PostgreSQL**) efficiently.",
    keywords: ["REST", "API", "web service", "HTTP", "Laravel", "endpoint"],
    patternSuggestions: [10, 11, 13],
    formatSuggestion: ["paragraph", "sentence"], // Plain text
    category: "Skills",
  },
  {
    id: 24,
    question: "How do you optimize website performance?",
    answer: "I optimize websites by:\n- Minimizing **CSS** and **JavaScript** files with **Vite**\n- Leveraging **lazy loading** for images\n- Using **Tailwind CSS** for efficient styling\nOn the backend, I optimize **Laravel** queries with **Eloquent** and use **caching** with **Redis** to reduce load times, ensuring a fast user experience.",
    keywords: ["optimize", "performance", "website", "speed", "efficiency", "caching"],
    patternSuggestions: [10, 11, 12],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 25,
    question: "Explain MVC architecture.",
    answer: "**MVC (Model-View-Controller)** is a design pattern I use in web development. It includes:\n- **Model**: Handles data and logic (e.g., Laravel’s Eloquent for MySQL)\n- **View**: Renders the UI (e.g., Vue.js templates)\n- **Controller**: Manages the flow (e.g., Laravel routes)\nThis separation keeps my projects organized and maintainable.",
    keywords: ["MVC", "architecture", "design", "pattern", "Laravel", "Vue.js"],
    patternSuggestions: [11, 12, 10],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 26,
    question: "How do you handle bugs or debugging?",
    answer: "I handle bugs by using a systematic approach:\n1. Replicate the issue\n2. Use browser dev tools (for frontend) and Laravel’s debugging (for backend)\n3. Apply fixes like optimizing queries or fixing Vue.js reactivity\nI also write unit tests with Jest to prevent future bugs.",
    keywords: ["bugs", "debugging", "fix", "testing", "troubleshooting"],
    patternSuggestions: [10, 13, 4],
    formatSuggestion: ["numbered", "list"], // Numbered list due to \n1.
    category: "Skills",
  },
  {
    id: 27,
    question: "What is your approach to version control?",
    answer: "I use Git for version control, managing repositories on GitHub. My approach includes:\n- Following a branching strategy (e.g., feature branches)\n- Committing often with clear messages\n- Using GitHub Actions for CI/CD to automate testing and deployment\nThis ensures code stability.",
    keywords: ["version control", "Git", "GitHub", "branching", "CI/CD"],
    patternSuggestions: [10, 11, 5],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 28,
    question: "How do you ensure code quality?",
    answer: "I ensure code quality by following best practices:\n- Writing clean, modular code with TypeScript and Laravel\n- Using linting tools like ESLint\n- Testing with Jest\n- Conducting code reviews (when collaborating)\n- Refactoring regularly to maintain readability and performance",
    keywords: ["code quality", "best practices", "testing", "refactor", "clean code"],
    patternSuggestions: [10, 26, 11],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 29,
    question: "What is your testing strategy?",
    answer: "My testing strategy includes:\n- Unit testing with Jest for Vue.js components and Laravel endpoints\n- Integration testing for API endpoints\n- Manual testing for UI/UX\nI prioritize edge cases and performance to ensure robust, user-friendly web applications.",
    keywords: ["testing", "strategy", "unit", "integration", "Jest"],
    patternSuggestions: [26, 10, 4],
    formatSuggestion: ["bullet", "list"], // List format due to \n-
    category: "Skills",
  },
  {
    id: 30,
    question: "How do you manage project requirements?",
    answer: "I manage requirements by:\n1. Gathering detailed client input during planning\n2. Documenting them in a spec sheet\n3. Breaking them into milestones\n4. Using tools like Trello for tracking\n5. Adjusting based on feedback to align with client goals throughout the SDLC",
    keywords: ["requirements", "management", "planning", "milestones", "Trello"],
    patternSuggestions: [5, 6, 22],
    formatSuggestion: ["numbered", "list"], // Numbered list due to \n1.
    category: "Work Preferences",
  },

  // Technical Implementation FAQs
  {
    id: 31,
    question: "How do you design APIs?",
    answer: "I follow these **API design principles**:\n1. Use **RESTful conventions** and proper HTTP methods\n2. Implement **versioning** (e.g., `/api/v1/`)\n3. Design **consistent endpoints** with clear naming\n4. Add proper **authentication** and **rate limiting**\n5. Include detailed **documentation** using **Postman/OpenAPI**\n6. Implement proper **error handling** with standard status codes\n7. Optimize for **performance** with caching and pagination",
    keywords: ["api", "design", "rest", "endpoints", "documentation", "swagger"],
    patternSuggestions: [23, 24, 25],
    formatSuggestion: ["numbered", "list"],
    category: "Technical Design",
  },
  {
    id: 32,
    question: "How do you handle large volume datasets in databases?",
    answer: "For large datasets, I employ several **optimization strategies**:\n- **Database indexing** on frequently queried columns\n- **Query optimization** using explain plans\n- **Partitioning** large tables by date or key ranges\n- Implementing **caching layers** with **Redis**\n- Using **batch processing** for bulk operations\n- Setting up **database replication** for read/write splitting\n- Regular **performance monitoring** and tuning",
    keywords: ["database", "optimization", "performance", "indexing", "caching", "large data"],
    patternSuggestions: [24, 13, 23],
    formatSuggestion: ["bullet", "list"],
    category: "Technical Design",
  },
  {
    id: 33,
    question: "What's your approach to application security?",
    answer: "My security approach includes multiple layers:\n1. **Input validation** and sanitization\n2. **Authentication** using **JWT** or session-based systems\n3. **Authorization** with role-based access control\n4. Protection against **XSS** and **CSRF** attacks\n5. **SQL injection** prevention using prepared statements\n6. **HTTPS** enforcement and proper SSL configuration\n7. Regular **security audits** and updates",
    keywords: ["security", "authentication", "authorization", "protection", "validation"],
    patternSuggestions: [31, 24, 27],
    formatSuggestion: ["numbered", "list"],
    category: "Technical Design",
  },
  {
    id: 34,
    question: "How do you implement caching strategies?",
    answer: "I implement caching at multiple levels:\n- **Browser caching** for static assets\n- **Application-level caching** using **Redis**\n- **Database query caching**\n- **API response caching**\n\nKey considerations include:\n- Cache invalidation strategies\n- TTL (Time To Live) settings\n- Cache key design\n- Memory usage monitoring",
    keywords: ["caching", "performance", "redis", "optimization", "memory"],
    patternSuggestions: [32, 24, 23],
    formatSuggestion: ["bullet", "list"],
    category: "Technical Design",
  },
  {
    id: 35,
    question: "How do you handle real-time features?",
    answer: "For real-time features, I use these technologies:\n- **WebSockets** for bi-directional communication\n- **Server-Sent Events** for one-way updates\n- **Laravel Echo** and **Pusher** for broadcasting\n- **Vue.js** reactive components for UI updates\n\nConsiderations include:\n- Connection management\n- Fallback mechanisms\n- Scalability planning",
    keywords: ["real-time", "websockets", "sse", "pusher", "broadcasting"],
    patternSuggestions: [34, 23, 24],
    formatSuggestion: ["bullet", "list"],
    category: "Technical Design",
  },
  {
    id: 36,
    question: "What's your approach to microservices architecture?",
    answer: "When designing microservices, I focus on:\n1. **Service boundaries** based on business domains\n2. **Inter-service communication** using REST/gRPC\n3. **Data consistency** patterns\n4. **Service discovery** and registration\n5. **Containerization** with **Docker**\n6. **Orchestration** using **Kubernetes**\n7. **Monitoring** and distributed tracing",
    keywords: ["microservices", "architecture", "docker", "kubernetes", "services"],
    patternSuggestions: [31, 32, 33],
    formatSuggestion: ["numbered", "list"],
    category: "Technical Design",
  }
];