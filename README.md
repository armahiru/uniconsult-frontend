# UniConsult Frontend

React-based frontend for the UniConsult lecturer consultation booking system.

## Features

- 🔐 Authentication (Login, Register, Email Verification, Password Reset)
- 👨‍🎓 Student Portal
  - Browse lecturers
  - Book appointments
  - View appointment history
  - Manage profile
- 👨‍🏫 Lecturer Portal
  - View appointment requests
  - Approve/Decline appointments
  - View schedule
  - Manage profile and availability
- 📱 Responsive design
- 🔔 Real-time notifications (Socket.io ready)
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- React Hot Toast
- Socket.io Client (for real-time features)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── student/     # Student portal pages
│   └── lecturer/    # Lecturer portal pages
├── context/         # React Context (Auth)
├── services/        # API service layer
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## API Integration

The frontend connects to the backend API at the URL specified in `VITE_API_URL`.

All API calls are handled through the `services/api.js` file which includes:
- Authentication endpoints
- Student endpoints
- Lecturer endpoints
- Notification endpoints

## Authentication

JWT tokens are stored in localStorage and automatically included in API requests via Axios interceptors.

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset

### Student Routes (Protected)
- `/student/dashboard` - Student dashboard
- `/student/lecturers` - Browse lecturers
- `/student/appointments` - View appointments
- `/student/profile` - Profile settings

### Lecturer Routes (Protected)
- `/lecturer/dashboard` - Lecturer dashboard
- `/lecturer/appointments` - Manage appointments
- `/lecturer/schedule` - View schedule
- `/lecturer/profile` - Profile settings

## Deployment

This app can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to set the `VITE_API_URL` environment variable to your production backend URL.
