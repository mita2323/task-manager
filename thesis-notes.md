# Thesis Notes

## Fas 2: Baseline-utveckling (inga tester)

### Features implementerade
- Backend: Express + MongoDB + Mongoose
- API: Full CRUD (GET/POST/PUT/DELETE /api/tasks)
- Frontend: React + Axios + TaskForm + TaskList
- Filter: All/Aktiva/Klara (?filter=param)
- Error handling: Frontend/backend validering
- UI: Responsive cards, form, status badges
- Persistence: MongoDB local (./data/db)

### Testade scenarier (baseline)
1. Tom titel
Resultat:
- I frontend händer ingenting när användaren försöker skicka en tom titel.
- I Postman returneras 400 Bad Request med meddelandet "Title required"
Tolkning:
- Valideringen fungerar i både frontend och backend.

2. Backend avstängd
Resultat:
- Frontend visar meddelandet "Failed to load tasks".
- I terminalen visas ERR_CONNECTION_REFUSED.
Tolkning:
- Systemet hanterar att tasks inte kan hämtas, men felet är generellt och återkommer så länge backend är nere.

3. Misslyckad POST
Resultat:
- Frontend visar bara "Failed to load tasks" eftersom backend är avstängd.
- När användaren försöker skapa en task visas inget separat felmeddelande för POST-försöket.
Tolkning:
- Frontend saknar tydlig felhantering för skapande av task vid misslyckad POST

4. Lista efter skapad task
Resultat:
- Listan uppdaterades korrekt direkt efter skapande utan omladdning av sidan.
- Nyaste tasks visas längst upp
Tolkning:
- Den grundläggande funktionaliteten för skapande och uppdatering av UI fungerar korrekt

5. Väldigt lång description
Resultat:
- En lång description accepterades.
- Texten visades som en väldigt lång sammanhängande text
Tolkning:
- Funktionen fungerar tekniskt, men det finns en möjlig användbarhetsbrist i gränssnittet

6. Felaktig data i Postman
Resultat: 
- Ingen titel: Man får meddelandet: "message": "Title required" och en status 400 bad request.
- Titel som mellanslag: Man får meddelandet: "message": "Title required" och en status 400 bad request.
- Title som nummer: Nummer accepteras och allt fungerar.
Tolkning:
- Numeriska värden accepteras.

### Tid använt
Setup (MongoDB+npm): 1h
Frontend CRUD: 3h
Backend API: 2h
Manuell testning (scenarion): 1.5h
Mindre justeringar: 0.5h

Total Fas 2: ~9 timmar

### Metrics (baseline)
Antal automatiserade tester: 0
Kodtäckning: 0%
Antal manuellt testade scenarier: 6
Identifierade brister: 4

---

## Fas 3: Enhetstester (Planerad)

### Planerade ändringar
Backend (Jest):
├── Unit: Controllers (createTask, updateTask)
├── Integration: Routes + DB mocks
└── Coverage: Jest --coverage

Frontend (Vitest):
├── TaskForm: Submit validation
├── TaskList: Render + toggle/delete
└── Homepage: Filter state changes

---

# Fas 3 – Enhetstestning

## Syfte
Att införa automatiserade enhetstester i frontend och backend för att undersöka hur detta påverkar testtäckning och identifiering av defekter.

## Verktyg
- Frontend: Vitest
- Backend: Jest

## Mätvärden
- Antal tester
- Testtäckning (coverage)
- Identifierade defekter
- Reflektioner kring utvecklingsprocessen

## Backend - enhetstestning

Enhetstester implementerades för taskController med hjälp av Jest. Databasmodellen mockades för att isolera controller-logiken från MongoDB.

Totalt implementerades 14 tester för följande funktioner:
- getTasks
- createTask
- updateTask
- deleteTask

Testfallen omfattade både normala scenarier och felhantering, inklusive:
- hämtning av tasks utan filter
- filtrering av aktiva och slutförda tasks
- skapande av task med giltig indata
- validering av saknad titel
- uppdatering och borttagning av existerande task
- hantering av fall där task inte hittades
- simulerade databasfel

Resultatet visade att samtliga 14 tester godkändes.

### Coverage
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

### Reflektioner
- Backend var relativt enkel att enhetstesta eftersom logiken kunde isoleras från databasen genom mocking.
- Testerna gjorde det möjligt att verifiera både funktionellt beteende och felhantering på ett systematiskt sätt.
- En tydlig fördel var att flera olika utfall kunde kontrolleras snabbt utan manuell testning.

## Frontend - enhetstestning



