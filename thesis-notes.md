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

Totalt Fas 2: ~9 timmar

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

### Täckning
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

### Reflektioner
- Backend var relativt enkel att enhetstesta eftersom logiken kunde isoleras från databasen genom mocking.
- Testerna gjorde det möjligt att verifiera både funktionellt beteende och felhantering på ett systematiskt sätt.
- En tydlig fördel var att flera olika utfall kunde kontrolleras snabbt utan manuell testning.

### Tid använt
Setup (Jest + mocking): 1h
Implementering av tester (getTasks, createTask): 2h
Implementering av tester (updateTask, deleteTask): 2h
Felhantering: 1h

Totalt backend: 6 timmar

## Frontend - enhetstestning

Enhetstester implementerades i frontend med Vitest och React Testing Library. 
Tre testfiler skapades för TaskForm, TaskList och Homepage.

Totalt implementerades 19 tester för följande funktioner:
- rendering av formulär och listkomponenter
- formulärsubmission och validering
- hantering av användarinteraktioner (toggle, delete, filter)
- API-anrop via service-lagret (getTasks, createTask, updateTask, deleteTask)

Testfallen omfattade:
- rendering av formulärfält och knappar i TaskForm
- validering av tom titel vid formulärsubmission
- kontroll av att inmatad data trimmas korrekt
- verifiering av att formuläret återställs efter lyckad submission
- rendering av tasks i TaskList
- hantering av tom lista
- verifiering av toggling och borttagning av tasks
- hämtning och visning av tasks i Homepage
- filtrering av tasks baserat på användarval
- skapande av nya tasks via formuläret
- uppdatering av tasks via checkbox
- borttagning av tasks från listan
- felhantering vid misslyckade operationer (hämtning, skapande, uppdatering och borttagning)
- hantering av alternativa kodvägar, exempelvis när en task inte hittas

### Täckning
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

Per komponent:
- TaskForm.jsx: 100% på samtliga mätvärden
- TaskList.jsx: 100% på samtliga mätvärden
- Homepage.jsx: 100% på samtliga mätvärden

### Reflektioner
- Frontend-testning krävde mer konfiguration än backend-testning.
- Det var enkelt att testa isolerade komponenter som TaskForm och TaskList.
- Homepage var svårare att täcka fullständigt eftersom komponenten innehåller fler tillstånd och fler beroenden.
- Testerna gjorde det möjligt att verifiera användarinteraktioner mer systematiskt än vid manuell testning.

Testerna utvecklades iterativt. Först implementerades grundläggande tester, därefter kördes `npm run test:coverage` för att identifiera vilka delar av koden som saknade täckning.

Baserat på resultatet skrevs ytterligare tester, främst för felhantering och alternativa kodvägar, tills full testtäckning uppnåddes.

### Tid använt
Setup (Vitest + RTL): 1h 
TaskForm tester: 2h
TaskList tester: 1.5h
Homepage tester (inkl. coverage-förbättringar): 4h  

### Totalt Fas 3:
Backend: 6 timmar
Frontend: 8.5 timmar
Backend + frontend: 16 timmar

---
