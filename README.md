# Heart Vibrate - Backend Server  

A robust **Node.js + Express** backend for the **Heart Vibrate** chat application, featuring authentication, real-time messaging, file uploads, and payment integration.  

## 🚀 Features  

### 🔒 Authentication & Security  
- **JWT-based authentication** (`jsonwebtoken`)  
- **Password hashing** (`bcrypt`)  
- **CORS & cookie management** (`cors`, `cookie-parser`)  

### 💬 Real-Time Chat  
- **Socket.IO** for instant messaging  
- **MongoDB** (via `mongoose`) for message history  

### 📝 Logging & Monitoring  
- **Winston** for structured logging  
- **Daily log rotation**  

---

## 🛠️ Tech Stack  

| Category       | Packages Used                          |  
|---------------|----------------------------------------|  
| **Runtime**   | Node.js (TypeScript)                   |  
| **Framework** | Express                                |  
| **Database**  | MongoDB (Mongoose)                     |  
| **Auth**      | JWT, Bcrypt                           |  
| **Realtime**  | Socket.IO                              |  
| **Logging**   | Winston + Daily Rotate File            |  
| **Linting**   | ESLint + Prettier                      |  

---

## ⚙️ Installation  

1. **Clone the repo**  
   ```sh 
   git clone https://github.com/shaishabcoding/heart-vibrate-server.git
   cd heart-vibrate-server
   ```

2. **Install dependencies**  
   ```sh
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file:  
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_KEY=your_stripe_api_key
   SMTP_USER=your_email@service.com
   SMTP_PASS=your_email_password
   ```

4. **Run the server**  
   ```sh
   npm run dev  # Development (ts-node-dev)
   ```
