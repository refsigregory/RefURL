# RefURL React Frontend

A modern, responsive React frontend for the RefURL URL shortener service. Built with TypeScript, Vite, Tailwind CSS, and React Query.

## Features

- 🚀 **Modern React Stack**: Built with React 18, TypeScript, and Vite
- 🎨 **Beautiful UI**: Styled with Tailwind CSS and Headless UI components
- 🔐 **Authentication**: Complete login/register system with JWT tokens
- 📊 **URL Management**: Create, edit, delete, and track your shortened URLs
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Optimized with React Query for efficient data fetching
- 🔒 **Protected Routes**: Secure authentication with route protection

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- RefURL API backend running (see [API setup](../api/express-typescript-api/README.md))

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd apps/web/react-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ProtectedRoute.tsx # Authentication guard
│   ├── UrlShortener.tsx   # URL shortening form
│   └── UrlList.tsx     # URL management list
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # User dashboard
│   └── Urls.tsx        # URL management page
├── services/           # API services
│   └── api.ts          # API client and endpoints
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## API Integration

The frontend integrates with the RefURL API backend. Key endpoints used:

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### URLs
- `POST /api/v1/urls/shorten` - Create short URL (public)
- `GET /api/v1/urls` - Get user's URLs
- `PUT /api/v1/urls/:id` - Update URL
- `DELETE /api/v1/urls/:id` - Delete URL
- `GET /api/v1/urls/go/:shortCode` - Redirect to original URL

## Features Overview

### Public Features
- **URL Shortening**: Anyone can shorten URLs without an account
- **Landing Page**: Beautiful homepage with features showcase
- **User Registration**: Easy account creation process

### Authenticated Features
- **Dashboard**: Overview of user's URLs and statistics
- **URL Management**: Full CRUD operations on URLs
- **Analytics**: Track clicks and performance
- **Custom Short Codes**: Create branded short URLs

### User Experience
- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation with helpful feedback
- **Copy to Clipboard**: One-click URL copying

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

### State Management
- React Query for server state
- React Context for authentication state
- Local state for form data and UI state

### Routing
- React Router for client-side routing
- Protected routes for authenticated pages
- Automatic redirects based on auth status

## Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Variables
Make sure to set the correct `VITE_API_URL` for your production API endpoint.

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Include proper error handling
4. Test on different screen sizes
5. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](../../../../LICENSE) file for details.
