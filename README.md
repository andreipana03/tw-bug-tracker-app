# Aplicatie web pentru gestionarea rezolvarii bug-urilor
	1.	Obiectiv general
Aplicatia are ca scop gestionarea bug-urilor aparute intr-un proiect software.
Ea permite comunicarea intre membrii echipei si testeri, urmarirea statusului fiecarui bug si organizarea activitatii de rezolvare.
	2.	Obiective specifice
• autentificare utilizatori pe baza de email si parola;
• inregistrare proiecte software si echipe de dezvoltare;
• adaugare testeri la proiecte existente;
• raportare bug-uri cu severitate, prioritate, descriere si link la commit;
• afisare si filtrare bug-uri pe proiect;
• alocare bug-uri catre un membru de proiect;
• actualizare status bug si commit de rezolvare;
• sistem de permisiuni in functie de rol:
o MP (membru proiect) poate crea si modifica proiecte, poate actualiza bug-uri;
o TST (tester) poate adauga bug-uri.
	3.	Tipuri de utilizatori si actiuni
Utilizator Actiuni principale
MP (Membru Proiect) Adauga si modifica proiecte, vizualizeaza bug-uri, isi aloca si actualizeaza bug-uri
TST (Tester) Se adauga la un proiect, raporteaza bug-uri
	4.	Cazuri de utilizare
	5.	Un student se conecteaza la aplicatie folosind emailul.
	6.	Un membru de proiect creeaza un proiect nou, adauga repository-ul si echipa.
	7.	Un tester se adauga la proiect ca participant extern.
	8.	Testerul inregistreaza un bug cu severitate si prioritate.
	9.	Membrul proiectului vizualizeaza bug-ul si il aloca spre rezolvare.
	10.	Dupa rezolvare, membrul actualizeaza statusul bug-ului si adauga commit-ul de corectare.

Plan de proiect
Etapa 1 – Analiza si proiectare
• definirea cerintelor aplicatiei;
• identificarea actorilor si actiunilor;
• proiectarea bazei de date (tabele: users, projects, bugs, project_members).

Etapa 2 – Configurare si initializare
• crearea repository-ului GitHub;
• initializarea mediilor de lucru pentru back-end (Node.js) si front-end (React);
• configurarea conexiunii la PostgreSQL prin Prisma.

Etapa 3 – Implementare back-end
• creare modele pentru User, Project si Bug;
• definire rute REST (login, register, projects, bugs);
• testare API cu Postman.

Etapa 4 – Implementare front-end
• creare pagini principale: Login, Dashboard, Projects, Bugs;
• conectare la API;
• gestionarea autentificarii si a rolurilor.

Etapa 5 – Testare si imbunatatiri
• verificarea fluxurilor de utilizare;
• corectarea erorilor;
• adaugarea mesajelor si validarilor.

Etapa 6 – Deployment
• Publicarea aplicatiei complete pe un server online, astfel incat utilizatorii sa o poata accesa printr-un link web si testarea functionarii corecte a tuturor componentelor.
