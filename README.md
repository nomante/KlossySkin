# KlossySkin - Premium Ecommerce Platform

A modern ecommerce website built with Next.js, TypeScript, Tailwind CSS, and featuring a complete shopping experience.

## Project Structure

```
src/
├── app/                           # Next.js app directory
│   ├── api/products/             # REST API endpoints
│   ├── products/                 # Product listing page
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Checkout page
│   ├── admin/                    # Admin dashboard
│   ├── layout.tsx                # Root layout with cart provider
│   └── page.tsx                  # Home page
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── ProductCard.tsx           # Product display component
│   └── CartContext.tsx           # Cart state management
├── lib/
│   ├── db.ts                     # Database utilities (mock)
│   └── auth.ts                   # Authentication utilities
└── types/
    └── index.ts                  # TypeScript type definitions
```

## Features

- **Product Catalog**: Browse and view products with details
- **Shopping Cart**: Add/remove items, persistent storage with localStorage
- **Checkout**: Complete order form with validation
- **Admin Dashboard**: Add new products and manage inventory
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **API Routes**: RESTful endpoints for products
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Dependencies are already installed
npm run dev
```

The application will start at `http://localhost:3000`

## Admin Login & Cloudinary Setup

Add these environment variables to a new `.env.local` file at the project root:

```
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.qybadeirmkfneegxyihh.supabase.co:5432/postgres

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=klossyskin
```

- **Admin login** is available at `/login`
- **Admin dashboard** is protected at `/admin`
- **Cloudinary** is used for image uploads (unsigned upload preset: `klossyskin`)
- **Inventory & products** are stored in Supabase PostgreSQL via TypeORM

## Available Routes

- `/` - Home page
- `/products` - Product listing
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/admin` - Admin dashboard
- `/api/products` - Get all products API
- `/api/products/[id]` - Get product by ID API

## Development

### Running the development server

```bash
npm run dev
```

### Building for production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management for shopping cart
- **Turbopack** - Next.js bundler for faster builds

## Future Enhancements

### Authentication & Users

- User registration and login
- User profile management
- Order history tracking

### Database Integration

- Replace mock database with MongoDB, PostgreSQL, or Firebase
- User authentication with NextAuth.js
- Order persistence

### Payment Processing

- Stripe or PayPal integration
- Payment gateway setup

### Admin Features

- Edit/delete products
- Inventory management
- Order management
- User management

### Additional Features

- Product search and filters
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Analytics dashboard

## Notes

Currently, the application uses mock data stored in memory. To persist data across sessions, integrate a real database:

1. Update `src/lib/db.ts` with your database connection
2. Implement proper authentication in `src/lib/auth.ts`
3. Add environment variables for sensitive configuration

## License

This project is open source and available under the MIT License.
