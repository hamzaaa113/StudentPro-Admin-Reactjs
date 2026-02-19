# Student Pro Admin - Project Structure

## 📁 Folder Structure

```
src/
├── api/                 # API configuration and endpoints
│   ├── axiosInstance.ts # Axios instance with interceptors
│   ├── endpoints.ts     # API endpoint constants
│
├── components/          # Reusable components
│   ├── PrivateRoute.tsx # Route protection component
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useLocalStorage.ts # Local storage hook
│
├── layouts/             # Layout components
│   ├── MainLayout.tsx   # Main application layout
│
├── pages/               # Page components
│   ├── Home.tsx         # Home page
│   ├── Login.tsx        # Login page
│   ├── NotFound.tsx     # 404 page
│   └── index.ts         # Page exports
│
├── services/            # API service functions
│   ├── authService.ts   # Authentication service
│   └── index.ts         # Service exports
│
├── types/               # TypeScript type definitions
│   ├── auth.types.ts    # Auth-related types
│   └── index.ts         # Type exports
│
├── utils/               # Utility functions
│   ├── helpers.ts       # Helper functions
│   └── index.ts         # Utility exports
│
├── App.css              # App styles
├── App.tsx              # Main App component with routing
├── index.css            # Global styles (Tailwind)
└── main.tsx             # Application entry point
```

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## 📦 Installed Packages

- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Prettier** - Code formatter with Tailwind plugin

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📝 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Prettier ignore patterns
- `.env.example` - Environment variables template

## 🔑 Key Features

- ✅ React Router configured with nested routes
- ✅ Axios instance with request/response interceptors
- ✅ Authentication service and hooks
- ✅ Private route protection
- ✅ Tailwind CSS integrated
- ✅ Prettier configured with Tailwind plugin
- ✅ Clean, scalable folder structure
- ✅ TypeScript support
- ✅ Reusable components and utilities
