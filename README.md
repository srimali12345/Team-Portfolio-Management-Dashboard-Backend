# 🚀 Team Portfolio Management Dashboard – Backend

This is the backend of the **Team Portfolio Management Dashboard**, built using **Node.js, Express, and MongoDB**.

## ⚙️ Tech Stack
- Node.js
- Express 5
- MongoDB (via Mongoose)
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests
- dotenv for environment variables
- Nodemon for development

## 📂 File Structure
```
src/
├── controllers/      # Request handlers for routes
├── middleware/       # Authentication & error handling
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── server.js         # Entry point of the backend
```

## 🚀 Getting Started
1. Clone the repo:
```bash
git clone https://github.com/srimali12345/Team-Portfolio-Management-Dashboard-Backend.git
cd Team-Portfolio-Management-Dashboard-Backend
```
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables in `.env`:
```
PORT=5000
MONGO_URI=<your_mongo_connection_string>
```
4. Run development server:
```bash
npm run dev
```
5. Production mode:
```bash
npm start
```

