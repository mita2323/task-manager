# Task Manager – Examensarbete

## Översikt
Detta projekt är en del av ett kandidatexamensarbete som undersöker effekten av automatiserad testning på små webbapplikationer.

Applikationen är en enkel fullstack **Task Manager** där användare kan skapa och visa uppgifter.  
Systemet utvecklas i flera faser för att analysera hur olika nivåer av testning påverkar mjukvarukvalitet.

---

## Syfte
Målet med projektet är att:

- Utvärdera effekten av automatiserad testning på:
  - Kodkvalitet
  - Bugghantering
  - Utvecklingsprocess
- Jämföra olika utvecklingsfaser:
  - Baseline (utan tester)
  - Enhetstester
  - End-to-end-tester
---

## Teknikstack

### Frontend
- React (Vite)
- Axios

### Backend
- Node.js
- Express
- MongoDB

---

## Krav

Följande behöver vara installerat:

- Node.js
- npm
- MongoDB

---

## Kom igång

### 1. Klona repot
```bash
git clone https://github.com/mita2323/task-manager.git
cd task-manager
```
### 2. Starta MongoDB

```bash
mongod --dbpath ./data/db
```

### 3. Starta Backend
```bash
cd backend
npm install
```
Skapa en .env fil:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
```
Starta servern:
```bash
npm run dev
```

### 4. Starta Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Testning

Projektet använder automatiserad testning i både backend och frontend.

### Backend (Jest)

Installera beroenden:
```bash
cd backend
npm install
```

Kör tester:
```bash
npm test
```

Kör tester med coverage:
```bash
npm run test:coverage
```

### Frontend (Vitest)

Installera beroenden:
```bash
cd frontend
npm install
```

Kör tester:
```bash
npm test
```

Kör tester med coverage:
```bash
npm run test:coverage
```

---

### API Endpoints

| Metod      | Endpoint         | Beskrivning         |
|------------|------------------|---------------------|
| **GET**    | `/api/tasks`     | Hämta alla tasks    |
| **POST**   | `/api/tasks`     | Skapa en ny task    |
| **PUT**    | `/api/tasks/:id` | Updatera en task    |
| **DELETE** | `/api/tasks/:id` | Ta bort en task     |

---

### Projektstruktur
```
task-manager/
│ 
├── backend/ 
│   ├── controllers/ 
│   ├── models/ 
│   ├── routes/ 
│   └── server.js
│ 
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/ 
│   └── App.jsx 
│ 
├── thesis-notes.md 
└── README.md
```