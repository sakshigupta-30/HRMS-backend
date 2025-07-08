# HRMS Backend API

This is the backend API for the HRMS (Human Resource Management System) Dashboard application.

## Features

- User authentication (Register/Login)
- JWT token-based authorization
- Candidate management (CRUD operations)
- MongoDB database integration
- RESTful API endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HRMS-Backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```

5. Seed the database with a default admin user
```bash
node seeders/userSeeder.js
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Candidates (Protected Routes)
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Add a new candidate
- `GET /api/candidates/:id` - Get a specific candidate
- `PUT /api/candidates/:id` - Update a candidate
- `DELETE /api/candidates/:id` - Delete a candidate

## Default Admin User

After running the seeder script, you can login with:
- Email: `admin@gmail.com`
- Password: `admin123`

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Database Schema

### User Schema
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (admin/hr/manager)
- isActive: Boolean

### Candidate Schema
- personalDetails: Object (name, email, phone, etc.)
- address: Object (street, city, state, country, zipCode)
- professionalDetails: Object (job title, department, salary, etc.)
- education: Array of education objects
- experience: Array of experience objects
- status: String (Applied/Screening/Interview/Selected/Rejected/On Hold)
- interviews: Array of interview objects
- notes: String
- tags: Array of strings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
