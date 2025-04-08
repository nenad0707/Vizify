# Vizify - Digital Business Card Platform

![Vizify Logo](/public/logo.png)

Vizify is a modern platform that lets you create, customize, and share interactive 3D digital business cards. Stand out from the crowd with premium designs that showcase your professional identity.

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

## 📋 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Card Templates](#-card-templates)
- [Development](#-development)
  - [Commands](#commands)
  - [Contributing](#contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

- **Interactive 3D Business Cards**: Create beautiful, animated digital business cards
- **Multiple Design Templates**: Choose from modern, classic, and minimalist templates
- **Custom Color Schemes**: Personalize your card with premium color options
- **QR Code Generation**: Easily share your digital card in person
- **Responsive Dashboard**: Manage all your digital cards in one place
- **One-click Sharing**: Share your digital presence through multiple channels
- **Download as Image**: Save your card for use in email signatures or print
- **Secure & Private**: Your data is encrypted and stored securely

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- A modern web browser for optimal 3D rendering

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/vizify.git
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

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, TypeScript, TailwindCSS
- **3D Rendering**: Three.js, React Three Fiber
- **Animation**: Framer Motion
- **Styling**: TailwindCSS, CSS Variables
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Shadcn UI
- **Deployment**: Vercel

## 📱 Project Structure

```
/src
  /app                # Next.js App Router
    /api              # API routes
    /card             # Public card viewing
    /create           # Card creation wizard
    /dashboard        # User dashboard
  /components         # React components
    /CardCreator      # Card creation components
    /ui               # UI component library
  /lib                # Utility functions
  /types              # TypeScript type definitions
```

## 🎨 Card Templates

Vizify offers three premium card templates:

- **Modern**: Dynamic color gradients with sleek finish
- **Classic**: Elegant side accent with refined details
- **Minimalist**: Clean design with elegant corner accent

Each template is fully customizable with your choice of premium colors.

## 💻 Development

### Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)

---

📌 Created with ❤️ by Nenad
