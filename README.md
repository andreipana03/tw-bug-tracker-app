# 🐞 Aplicatie Web pentru Gestionarea Rezolvarii Bug-urilor

> O aplicatie moderna destinata gestionarii si urmaririi bug-urilor aparute in cadrul proiectelor software.  
> Permite comunicarea intre membrii echipei si testeri, urmarirea statusului fiecarui bug si organizarea activitatilor de rezolvare.

---

## 📋 Cuprins
- [🎯 Obiectiv General](#-obiectiv-general)
- [⚙️ Obiective Specifice](#️-obiective-specifice)
- [👥 Tipuri de Utilizatori si Actiuni](#-tipuri-de-utilizatori-si-actiuni)
- [🧩 Cazuri de Utilizare](#-cazuri-de-utilizare)
- [🛠️ Plan de Proiect](#️-plan-de-proiect)
- [🚀 Etapele de Dezvoltare](#-etapele-de-dezvoltare)

---

## 🎯 Obiectiv General

Aplicatia are ca scop **gestionarea bug-urilor aparute intr-un proiect software**.  
Ea permite:
- comunicarea eficienta intre membrii echipei si testeri,  
- urmarirea statusului fiecarui bug,  
- organizarea activitatii de rezolvare intr-un mod centralizat si transparent.

---

## ⚙️ Obiective Specifice

- 🔐 Autentificare utilizatori pe baza de email si parola  
- 🧾 Inregistrare proiecte software si echipe de dezvoltare  
- 👤 Adaugare testeri la proiecte existente  
- 🐛 Raportare bug-uri cu severitate, prioritate, descriere si link la commit  
- 🔍 Afisare si filtrare bug-uri pe proiect  
- 👨‍💻 Alocare bug-uri catre un membru al proiectului  
- ♻️ Actualizare status bug si commit de rezolvare  
- 🔑 Sistem de permisiuni in functie de rol:
  - **MP (Membru Proiect):** poate crea si modifica proiecte, actualiza bug-uri  
  - **TST (Tester):** poate adauga bug-uri  

---

## 👥 Tipuri de Utilizatori si Actiuni

| Utilizator | Actiuni principale |
|-------------|--------------------|
| 🧑‍💻 **MP (Membru Proiect)** | Adauga si modifica proiecte, vizualizeaza bug-uri, isi aloca si actualizeaza bug-uri |
| 🧪 **TST (Tester)** | Se adauga la un proiect, raporteaza bug-uri |

---

## 🧩 Cazuri de Utilizare

1. 🧑‍🎓 Un student se conecteaza la aplicatie folosind emailul.  
2. 👨‍💻 Un membru de proiect creeaza un proiect nou, adauga repository-ul si echipa.  
3. 🧪 Un tester se adauga la proiect ca participant extern.  
4. 🐞 Testerul inregistreaza un bug cu severitate si prioritate.  
5. 🔍 Membrul proiectului vizualizeaza bug-ul si il aloca spre rezolvare.  
6. ✅ Dupa rezolvare, membrul actualizeaza statusul bug-ului si adauga commit-ul de corectare.  

---

## 🛠️ Plan de Proiect

Aplicatia este dezvoltata incremental, urmand mai multe etape logice si tehnice.

---

## 🚀 Etapele de Dezvoltare

### 🧱 Etapa 1 – Analiza si Proiectare
- Definirea cerintelor aplicatiei  
- Identificarea actorilor si actiunilor  
- Proiectarea bazei de date (tabele: `users`, `projects`, `bugs`, `project_members`)

---

### ⚙️ Etapa 2 – Configurare si Initializare
- Crearea repository-ului GitHub  
- Initializarea mediilor de lucru pentru:
  - **Back-end:** Node.js  
  - **Front-end:** React  
- Configurarea conexiunii la **PostgreSQL** prin **Prisma**

---

### 🧩 Etapa 3 – Implementare Back-End
- Crearea modelelor pentru `User`, `Project` si `Bug`  
- Definirea rutelor REST (`login`, `register`, `projects`, `bugs`)  
- Testarea API-ului cu **Postman**

---

### 🖥️ Etapa 4 – Implementare Front-End
- Crearea paginilor principale: **Login**, **Dashboard**, **Projects**, **Bugs**  
- Conectare la API  
- Gestionarea autentificarii si a rolurilor

---

### 🧪 Etapa 5 – Testare si Imbunatatiri
- Verificarea fluxurilor de utilizare  
- Corectarea erorilor  
- Adaugarea mesajelor si validarilor

---

### 🌐 Etapa 6 – Deployment
- Publicarea aplicatiei complete pe un server online  
- Asigurarea accesului utilizatorilor printr-un link web  
- Testarea functionarii corecte a tuturor componentelor

---

## 💡 Concluzie

Aceasta aplicatie reprezinta un instrument complet pentru gestionarea bug-urilor intr-un mediu colaborativ, asigurand o mai buna transparenta, eficienta si comunicare intre membrii echipei de dezvoltare si testeri.

---

⭐️ *Daca ti-a placut acest proiect, nu uita sa-i dai un star pe GitHub!*  
