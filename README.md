# 🌍 Natours Backend API

An Express.js-based RESTful API project built during my Node.js learning journey. This backend handles core operations for a fictional travel/tour booking app — **Natours** — with proper routing, environment configuration, and API structure.

---

## 🚀 Features

- ✅ RESTful API endpoints for Tours and Users
- 🔐 Environment variable management using `dotenv`
- 🧱 Modular Express Routers for cleaner code structure
- 🧩 Middleware setup:
  - Logging with `morgan`
  - JSON body parsing
  - Serving static files from `public/`
  - Custom middleware for request timestamps
- 🧪 Dev/Prod environment separation using `NODE_ENV`
- 🔁 Nodemon and `cross-env` for improved development workflow

---

## 📂 Project Structure

```
starter/
├── controllers/
├── routes/
├── public/
├── config.env
├── server.js
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
git clone https://github.com/barkatullah-khan/natours-backend.git
cd natours-backend
npm install
```

---

## 🧪 Running the Server

### Development Mode (auto-reload with nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm run start:prod
```

> Note: Cross-platform production mode uses `cross-env`

---

## 🔐 Environment Variables

Create a file named `config.env` in the root folder with the following:

```env
PORT=3000
NODE_ENV=development
DATABASE_PASSWORD=yourPasswordHere
API_KEY=abcdef123456
```

`.env` is included in `.gitignore` for security.

---

## 📡 API Endpoints

### Tours

- `GET /api/v1/tours` → List all tours
- `POST /api/v1/tours` → Create a new tour
- `GET /api/v1/tours/:id` → Get tour by ID
- `PATCH /api/v1/tours/:id` → Update a tour
- `DELETE /api/v1/tours/:id` → Delete a tour

### Users

- Similar route structure exists for `/api/v1/users`

---

## 📚 What I Learned

- Setting up a Node.js backend using Express
- Creating RESTful APIs with modular routes
- Managing environments and secrets using `dotenv`
- Using `nodemon` and `cross-env` for smooth dev workflow
- Writing middleware and organizing Express apps professionally
- Git and GitHub basics: init, commit, push, remote

---

## 🤝 Let's Connect!

This project is a part of my backend development journey as a full-stack developer. I’m sharing my progress publicly and would love to connect with others on the same path!

🔗 [LinkedIn – Barkatullah Khan](https://www.linkedin.com/in/barkatullah-khan)

---

## 📜 License

This project is for educational and personal portfolio use. Feel free to fork and build upon it.
