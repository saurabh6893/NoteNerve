# PDF NotebookLM Clone

**Status:** Draft

## Project Structure

- **backend/** — Express API, AI integration
- **frontend/** — React + TS client, PDF viewer & chat UI

## Scripts

# PDF NotebookLM Clone

A full‑stack application inspired by Google’s NotebookLM, allowing users to upload PDFs, view them in‑browser, and chat alongside them.

---

## 🚀 Tech Stack

**Frontend**

- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/) for styling
- [`react-pdf`](https://github.com/wojtekmaj/react-pdf) for PDF rendering

**Backend**

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) for data storage
- [Multer](https://github.com/expressjs/multer) for PDF uploads
- Static file serving for uploaded PDFs

---

## 📂 Current Features (as of August 2025)

- **Health Check** – `/api/health` confirms backend is running
- **Chat**
  - Send messages to backend
  - Loads conversation history from MongoDB
  - Clear history endpoint
- **PDF Upload**
  - Upload `.pdf` files from the frontend
  - Files stored in `backend/uploads/` with timestamped filenames
  - Path returned to frontend
- **PDF Viewer**
  - Renders uploaded PDFs in‑app with pagination-like scrolling
  - PDF.js worker served locally to avoid CORS issues
  - Sharper rendering using scale (HiDPI‑aware)
- **Frontend UI**
  - React functional components with hooks
  - Separate components for Upload, Viewer, Chat
  - Tailwind styling with flex/spacing/layouts designed for stacking components

---

## 📁 Project Structure

pdf-notebooklm-clone/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── uploads/ # PDF file storage (git‑ignored)
│ ├── index.js # Express app entry
│ └── ...
├── frontend/
│ ├── public/
│ │ ├── pdf.worker.js # PDF.js worker (served locally)
│ ├── src/
│ │ ├── components/
│ │ │ ├── PDFUpload.tsx
│ │ │ ├── PDFViewer.tsx
│ │ │ └── ChatInterface.tsx
│ │ ├── App.tsx
│ │ ├── api.ts
│ │ └── ...
│ └── ...
└── ...

---

## 🛠️ Setup and Running Locally

### **1. Clone the repo**

git clone <your-repo-url>
cd pdf-notebooklm-clone

### **2. Install backend dependencies**

cd backend
npm install

### **3. Install frontend dependencies**

cd ../frontend
npm install

PORT=5000
MONGO_URL=mongodb://localhost:xxxxx/notebooklm

And optionally in `frontend/`:

VITE_API_BASE_URL=http://localhost:5000

### **5. Run**

In two terminals:

Terminal 1: backend
cd backend
npm run serve

Terminal 2: frontend
cd frontend
npm run dev

Open: `http://localhost:5173`

---

## 📌 Current Limitations

- **Chat** currently echoes input; no AI processing or PDF‑aware answers
- **No citations linking chat → PDF page** (Planned: Step 10)
- No vector search or semantic search yet
- Large PDFs render all pages at once; no pagination or lazy‑loading

---

## 🗺️ Roadmap

1. ✅ Backend setup + MongoDB + chat endpoints
2. ✅ PDF upload endpoint
3. ✅ Frontend upload UI + PDF viewing
4. ⏳ **Step 10**: Citation linking (click chat → scroll viewer)
5. ⏳ AI integration for PDF‑aware answers
6. ⏳ PDF text extraction + embeddings + vector DB
7. ⏳ Pagination/lazy load for large PDFs
8. ⏳ UI/UX polish
9. ⏳ Deployment (frontend + backend)
10. ⏳ Testing & CI/CD

---

## 📜 License

MIT
