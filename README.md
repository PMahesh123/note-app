### Full-Stack Note Application ###

A modern note-taking app with email/OTP and Google authentication, built with React (TypeScript), Node.js, and MongoDB.

### Features

- Create and delete notes
- Secure authentication:
- Email + OTP verification
- Google OAuth login
- Mobile-responsive design
- JWT-based authorization
- Real-time updates

### Technologies Used

**Frontend:**
- React with TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB (with Mongoose)
- JWT Authentication
- Nodemailer (for OTP emails)
- Passport.js (for Google OAuth)

### Prerequisites

Before running the project, ensure you have installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Getting Started

### Local Setup 

1. **Clone the repository**
   
   git clone https://github.com/your-username/note-taking-app.git
   cd note-taking-app
Set up the backend

cd server
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
Set up the frontend

cd ../client
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
Access the app

Frontend: http://localhost:3000

Backend API: http://localhost:5000
