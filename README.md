# 🌟 Vizify - Interactive 3D Digital Business Card Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel&logoColor=white)](https://vizify.vercel.app/)

**Vizify** is a modern web application built with **Next.js** that allows users to create, customize, and share interactive 3D digital business cards. Leveraging cutting-edge technologies like **Three.js** for 3D rendering and **Framer Motion** for smooth animations, Vizify helps professionals stand out with stunning digital business cards that showcase their personal brand.

## 🌐 Live Demo

[![Vizify Demo](https://img.shields.io/badge/Vizify-Live%20Demo-5277C3?style=for-the-badge&logo=react&logoColor=white)](https://vizify.vercel.app/)

> **⚠️ Note:** Registration is required for creating and managing your own digital business cards.

---

## 📖 Table of Contents

- [🌟 Vizify - Interactive 3D Digital Business Card Platform](#-vizify---interactive-3d-digital-business-card-platform)
  - [🌐 Live Demo](#-live-demo)
  - [📖 Table of Contents](#-table-of-contents)
  - [📚 Project Overview](#-project-overview)
  - [✨ Features](#-features)
  - [📸 Screenshots](#-screenshots)
    - [🖥️ Desktop View](#️-desktop-view)
      - [Dashboard](#dashboard)
      - [Card Creator](#card-creator)
      - [Card Sharing Page](#card-sharing-page)
    - [📱 Mobile View](#-mobile-view)
  - [🛠️ Tech Stack & Tools](#️-tech-stack--tools)
    - [Frontend](#frontend)
    - [Backend & Database](#backend--database)
    - [Authentication](#authentication)
    - [3D Rendering](#3d-rendering)
    - [Deployment](#deployment)
  - [🔍 Architecture Overview](#-architecture-overview)
    - [Key Components](#key-components)
  - [🎯 Design Decisions](#-design-decisions)
  - [📱 Responsive Design](#-responsive-design)
  - [🎨 Card Templates](#-card-templates)
  - [💻 Development](#-development)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Commands](#commands)
    - [Contributing](#contributing)
  - [📄 License](#-license)
  - [🙏 Acknowledgments](#-acknowledgments)

---

## 📚 Project Overview

Vizify revolutionizes how professionals share their contact information by providing an immersive and interactive digital business card experience. Users can:

- Create personalized business cards with custom colors and templates
- Share cards via QR codes or direct links
- Manage multiple cards through a streamlined dashboard
- Showcase their professional identity with animated 3D cards

Built with a focus on user experience and visual appeal, Vizify combines cutting-edge web technologies to deliver a seamless and memorable digital presence solution.

---

## ✨ Features

- 🌈 **Interactive 3D Business Cards**: Stunning animated cards with realistic 3D effects powered by Three.js
- 🎨 **Multiple Design Templates**: Choose from modern, classic, and minimalist templates to match your style
- 🎭 **Custom Color Schemes**: Personalize your card with premium color options that reflect your brand
- 📱 **Responsive Design**: Perfect viewing experience across all devices - desktop, tablet, and mobile
- 📊 **User Dashboard**: Comprehensive dashboard to create, edit, and manage all your digital cards
- 🔄 **Real-time Preview**: See your changes instantly as you customize your business card
- 📤 **One-click Sharing**: Share your digital presence through multiple channels with ease
- 🔒 **Secure Authentication**: Protected user accounts with NextAuth.js and secure data storage
- 📱 **QR Code Generation**: Easily share your digital card in person with auto-generated QR codes
- 🖼️ **Download as Image**: Save your card for use in email signatures or other digital platforms
- 🔍 **SEO-Optimized Public Pages**: Card sharing pages designed for maximum discoverability

---

## 📸 Screenshots

### 🖥️ Desktop View

#### Dashboard
![Dashboard](/public/screenshots/dashboard.png)

#### Card Creator
![Card Creator](/public/screenshots/card-creator.png)

#### Card Sharing Page
![Card Sharing](/public/screenshots/card-view.png)

### 📱 Mobile View
![Mobile View](/public/screenshots/mobile-view.png)

---

## 🛠️ Tech Stack & Tools

### Frontend
- **Next.js**: React framework with server-side rendering and static site generation
- **TypeScript**: Type safety and improved developer experience
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Advanced animations and transitions
- **Shadcn UI**: Beautifully designed accessible UI components
- **Lucide Icons**: Beautiful and consistent icon set

### Backend & Database
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Type-safe database access and migrations
- **MySQL**: Robust relational database for data storage

### Authentication
- **NextAuth.js**: Flexible authentication solution with built-in providers
- **JWT**: Secure token-based authentication

### 3D Rendering
- **Three.js**: JavaScript 3D library for rendering interactive 3D graphics
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components for React Three Fiber

### Deployment
- **Vercel**: Platform optimized for Next.js applications with CI/CD

---

## 🔍 Architecture Overview

Vizify follows a modern Next.js architecture that separates concerns while keeping related code together for better maintainability:

### Key Components

1. **Pages & API Routes**: Next.js pages for the frontend with API routes handling backend logic
2. **React Components**: Modular UI components organized by functionality
3. **3D Rendering Engine**: Custom Three.js implementation for interactive card previews
4. **Database Layer**: Type-safe database access through Prisma ORM
5. **Authentication System**: Secure user authentication with NextAuth.js
6. **Shared Types & Utilities**: Common types and helper functions

The application uses a hybrid approach with both server-side rendering and client-side interactivity for optimal performance and SEO.

---

## 🎯 Design Decisions

1. **3D Rendering Strategy**: For performance optimization, we implement different rendering approaches:
   - Full 3D WebGL rendering for interactive card previews
   - CSS 3D transforms for lighter card representations in listings
   - Server-side generated previews for sharing images

2. **Modular Components**: UI components are built with composition in mind, following atomic design principles to maximize reusability.

3. **Design System**: A consistent design language using TailwindCSS with custom theme variables ensures visual coherence throughout the application.

4. **Performance Optimization**: Dynamic imports, code splitting, and optimized assets keep the application fast and responsive even with complex 3D elements.

---

## 📱 Responsive Design

Vizify is built with a mobile-first approach, ensuring a great user experience across all devices:

- **Adaptive Layouts**: Flexbox and CSS Grid for responsive content organization
- **Touch-Optimized**: Controls designed for both mouse and touch interaction
- **Performance Focused**: Optimized 3D rendering based on device capabilities
- **Progressive Enhancement**: Core functionality works on all devices, with enhanced experiences on capable browsers

---

## 🎨 Card Templates

Vizify offers three premium card templates, each with distinct visual characteristics:

- **Modern**: Dynamic color gradients with geometric accents and a sleek finish
- **Classic**: Elegant side accent with refined details for a traditional business card feel
- **Minimalist**: Clean design with subtle corner accents for a contemporary, uncluttered look

Each template is fully customizable with your choice of premium colors and information fields.

---

## 💻 Development

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- MySQL database
- A modern web browser for optimal 3D rendering

### Installation

1. Clone the repository
```bash
git clone https://github.com/nenad0707/Vizify.git
cd vizify
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit the `.env.local` file and add your database connection string and other required credentials.

4. Set up the database
```bash
npx prisma db push
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality
- `npm run test`: Run test suite (if configured)

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)

---

📌 Created with ❤️ by Nenad | [Portfolio](https://risticnenad.com/) | [LinkedIn](https://linkedin.com/in/nenadtarailo)
