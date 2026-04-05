# RateMyProf 

A full-stack web app to discover and review professors.

## 🚀 Features

* View all professors
* Search by name or department
* View individual professor pages
* Add reviews (rating + comment)
* View all reviews for a professor
* Dynamic average rating calculation
* Basic validation and anti-spam UX

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (React)
* **Backend:** Node.js + Express
* **Database:** Supabase (PostgreSQL)

---

## ⚙️ How to Run Locally

### 1. Clone repo

```bash
git clone https://github.com/tejasbhardwaj1/ratemyprof.git
cd ratemyprof
```

### 2. Start backend

```bash
cd backend
node index.js
```

### 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 API Routes

* `GET /professors` → get all professors
* `GET /professors/:id` → get single professor
* `GET /reviews/:professor_id` → get reviews
* `POST /reviews` → add review

---

## 👨‍💻 Author

Tejas Bhardwaj
