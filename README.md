# Conversational Chatbot for FAQs

A conversational chat application built with Vue 3, Vite, and TypeScript, integrating generative AI to provide real-time, interactive responses, similar to popular AI chat platforms. This project leverages modern web technologies for a sleek, responsive user experience with a focus on maintainability and performance.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Next Steps](#next-steps)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- Vue.js 3
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/           # Static assets (e.g., style.css)
├── components/       # Reusable components
├── composables/      # Composables (e.g., useCounter.ts)
├── constants/        # Static content
├── layouts/          # Layout components
├── stores/          # Pinia store modules
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── App.vue          # Root component
├── main.ts          # Entry point
└── vite-env.d.ts    # Vite TypeScript env
```

## Development Guidelines

- **Code Style**: Use concise, declarative TypeScript with functional patterns
- **File Naming**:
  - Components: PascalCase (e.g., `MyComponent.vue`)
  - Directories: lowercase with dashes (e.g., `my-component`)
- **Composables**: Prefix with `use` (e.g., `useFetch.ts`)
- **Types**: Use interfaces over types, avoid enum
- **Styling**: Leverage Tailwind CSS with a mobile-first approach
- **Components**: Follow SFC pattern with `<script setup>`
- Follow Vue 3 Composition API best practices
- Use TypeScript for type safety
- Follow the project's code style guide
- Implement responsive design using Tailwind CSS
- Optimize for performance and accessibility
## Next Steps

#### **1️⃣ User-Friendly Interface**  
🔲 **Collapsible Chat Box** - like the messenger interface
🔲 **Option to End Chat & Start a New Conversation** 
🔲 **Customizable Chat Theme** – Allow users to toggle between light/dark mode or select a theme.  
✅ **Typing Indicator** – Show a "bot is typing..." animation for a more natural feel.  
✅ **Quick Reply Buttons** – Provide suggested questions that users can tap instead of typing.  
✅ **Starter Categorizationonversation** - Show a "starter conversation for a more natural like "Hello i am Javecilla ChatBot, How can i assist you?" and then show suggestions questions like "Who are you?", "What’s your background? and  "What services do you offer?",

#### **2️⃣ Improved Chat Experience**  
✅ **Chunked AI Responses for Real-Time Feel** - Show AI responses in chunks for a more natural flow.
✅ **Autoscroll to Latest Message** – Ensure new messages are always visible.  
🔲 **Message Timestamp** – Show timestamps for each user and bot message.  
🔲 **Emoji & Markdown Support** – Improve readability and engagement with emojis or formatting (bold, italics, etc.).  

#### **3️⃣ Persistent & Session-Based Features**  
✅ **Store Chat (state-pinia) History for Current Session** 
🔲 **Load Previous Chats on Page Reload** – Restore chat history when the user revisits.  
🔲 **Local Storage or Database Option** – Store chat history beyond the current session for returning users.  

#### **4️⃣ Smart Features & Enhancements**  
✅ **Smart Search for FAQs** – Let users type keywords, and the chatbot suggests related FAQs.  
✅ **Fallback Handling** – If the bot doesn't know an answer, it can guide the user to contact you or check your website.  
✅ **FAQ Categorization** – Organize FAQs into categories (e.g., Services, Pricing, Contact).  
🔲 **Voice-to-Text Support** – Allow users to speak their question instead of typing.  
🔲 **Multilingual Support** – allow switching languages.  

#### **5️⃣ Accessibility**  
✅ **Screen Reader Support** – Ensure content is readable by screen readers.  
🔲 **Keyboard Navigation** – Allow users to navigate the chat interface using the keyboard
...

## Demo

You can try the live demo [https://chatbot-faqs.vercel.app/](https://chatbot-faqs.vercel.app/)

## Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](https://github.com/Javecilla/chatbot-faqs/blob/main/CONTRIBUTING.md).

## Contact

- Portfolio: [jerome-avecilla.vercel.app](https://jerome-avecilla.vercel.app/)
- Email: jeromesavc@gmail.com
- GitHub: [@javecilla](https://github.com/javecilla)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.