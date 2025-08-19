# Tenmil Frontend

A modern React TypeScript frontend application built with Vite, featuring responsive design and centralized API management.

## Features

- ✅ **React 18** with TypeScript
- ✅ **Vite** for fast development and building
- ✅ **SASS** with organized architecture (variables, mixins, components)
- ✅ **Responsive Design** - Viewport-based sizing with 1366x720+ breakpoint
- ✅ **Centralized API Service** with Axios supporting subdomain routing
- ✅ **4-Part Layout System** (Header, Footer, Sidebar, Main Content)
- ✅ **Dark/Light Theme** support

## Architecture

### Responsive Design Rules

The application follows specific responsive design rules:
- **Responsive Mode**: For screens ≥ 1366x720, uses viewport units (vw, vh)
- **Fixed Mode**: For smaller screens, uses fixed dimensions with scrollbars
- **Viewport-based sizing**: All dimensions use viewport units, no static pixels

### API Service

Centralized API service supports three subdomain configurations:
- `admin.localhost` → `http://admin.localhost:3000/api`
- `localhost` → `http://localhost:3000/api`
- `*.localhost` → `http://{subdomain}.localhost:3000/api`

### SASS Architecture

```
src/styles/
├── abstracts/
│   ├── _variables.scss    # Colors, breakpoints, dimensions
│   └── _mixins.scss       # Responsive mixins, utilities
├── base/
│   └── _reset.scss        # CSS reset and base styles
├── layout/
│   └── _main-layout.scss  # Grid layout for 4-part structure
├── components/
│   ├── _buttons.scss      # Button styles
│   ├── _cards.scss        # Card components
│   └── _navigation.scss   # Navigation styles
└── main.scss              # Main entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

### Layout System

```tsx
import { Layout } from './components/layout';

function App() {
  return (
    <Layout 
      headerTitle="My App"
      headerContent={<button>Action</button>}
      sidebarContent={<nav>...</nav>}
    >
      <div>Main content goes here</div>
    </Layout>
  );
}
```

### API Service

```tsx
import apiService from './services/api';

// GET request
const users = await apiService.get('/users');

// POST request
const newUser = await apiService.post('/users', userData);

// Check current subdomain
console.log(apiService.getSubdomainType()); // 'admin' | 'main' | 'wildcard'
```

### Responsive Components

Use the provided SASS mixins for consistent responsive behavior:

```scss
.my-component {
  @include viewport-size(50vw, 30vh);
  @include viewport-spacing(padding, 2vh, 2vw, 2vh, 2vw);
  @include viewport-font-size(1.2rem);
}
```

## Development

### Project Structure

```
src/
├── components/
│   └── layout/           # Layout components
├── services/
│   ├── api.ts           # Centralized API service
│   └── types.ts         # TypeScript interfaces
├── styles/              # SASS architecture
└── App.tsx              # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding New Components

1. Create component in appropriate directory
2. Add corresponding SASS file in `src/styles/components/`
3. Import SASS file in `src/styles/main.scss`

### Modifying Responsive Breakpoint

Edit `$min-responsive-width` and `$min-responsive-height` in `src/styles/abstracts/_variables.scss`

### Adding New API Endpoints

Extend the `apiService` class or create specific service classes that use the base `apiService`.

## License

MIT