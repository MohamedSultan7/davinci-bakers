# DaVinci Bakers - Wholesale Bakery Platform

A modern B2B e-commerce platform for wholesale bakery operations, built with React, TypeScript, and Vite.

## Features

- **Product Catalog**: Browse artisan breads, pastries, and baked goods
- **User Authentication**: Secure login and registration system with email verification
- **Shopping Cart**: Add products to cart with quantity management
- **Order Management**: Place orders and track order history
- **Responsive Design**: Mobile-first design with modern UI components
- **Mock Data**: Development environment with realistic mock data

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── shared/         # Shared components (Layout, Navigation, etc.)
│   └── ui/             # Base UI components (Button, Card, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── mocks/              # Mock data and services
├── pages/              # Page components
├── stores/             # State management (Zustand stores)
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## Development

The application uses mock data for development. To switch to a real API:

1. Update the `useMocks` flag in `src/lib/runtime.ts`
2. Configure API endpoints in the same file
3. Implement real API client methods in `src/lib/apiClient.ts`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

This project is proprietary software developed for DaVinci Bakers.
