# RCX Member Self Service Portal - React Version

This is the React version of the RCX Member Self Service Portal, converted from Angular.

## Features

- Member Dashboard
- Purchase History
- Rewards Management
- Checkout Process
- Purchase Confirmation
- Authentication and Authorization

## Tech Stack

- React 18
- TypeScript
- Material-UI
- Tailwind CSS
- React Router
- Axios

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `https://rcx-crud.sales2.rcx-demo.lmvi.net`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/         # React components
├── contexts/          # React context providers
├── guards/            # Route guards
├── hooks/             # Custom React hooks
├── services/          # API services
├── utils/             # Utility functions
├── config/            # Configuration files
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Key Features

### Authentication

The application uses a token-based authentication system. The `AuthGuard` component protects routes that require authentication.

### State Management

The application uses React Context for state management, with separate contexts for different features:

- ActivityContext: Manages member activities and rewards
- AuthContext: Manages authentication state

### Styling

The application uses a combination of:

- Material-UI components
- Tailwind CSS for utility classes
- Custom CSS for specific components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 