# Chat App Frontend

A modern chat application built with React, TypeScript, and Vite.

## Features

- User authentication (login/register)
- Real-time messaging with Socket.io
- Room-based chat
- Beautiful UI with TailwindCSS and shadcn/ui
- State management with Zustand
- Data fetching with React Query

## Tech Stack

- ⚛️ React + TypeScript
- 🎨 TailwindCSS
- 🧩 shadcn/ui (UI components)
- ⚡ Zustand (state management)
- 🚀 React Query (server data)
- 💬 Socket.io client (real-time)
- 🛣️ React Router (routing)

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend

Make sure the backend is running on `http://localhost:5000`.

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
