# Webshop

Mini webshop aplikacija izrađena kao testni zadatak za firmu NEPTIS.

## 🌐 Online Demo

* Webshop URL: [https://webshop-neptis.vercel.app](https://webshop-neptis.vercel.app)
* API URL (Render): [https://webshop-qz8k.onrender.com](https://webshop-qz8k.onrender.com)

## 🔑 Admin Pristup

* Email: `admin@gmail.com`
* Šifra: `123456`

Ili alternativno:

* Email: `nedim.begovic@example.com`
* Šifra: `123456`

## 👥 Korisnici

* Gost/Registrovani korisnik: može pregledati proizvode, dodavati u korpu i kreirati narudžbe.
* Admin: ima potpunu kontrolu nad proizvodima i narudžbama.

---

## 🚀 Tehnologije

### Frontend

* [Next.js](https://nextjs.org/) (React.js framework)
* [Tailwind CSS](https://tailwindcss.com/)
* `react-hook-form` za forme

### Backend

* [FastAPI](https://fastapi.tiangolo.com/)
* SQLAlchemy ORM
* PostgreSQL baza (Aiven Cloud)

---

## 📊 Funkcionalnosti

### Webshop (Guest)

* Početna stranica sa proizvodima (filtriranje, sortiranje)
* Detalji proizvoda
* Dodavanje u korpu, uređivanje i brisanje
* Checkout i kreiranje narudžbe (ime, adresa, telefon itd.)

### Admin Panel

* Login/autentikacija admin korisnika
* Dashboard: pregled svih proizvoda
* Dodavanje, izmjena i brisanje proizvoda
* Detalji narudžbi, status narudžbe: `pending`, `accepted`, `rejected`, `completed`

---

## 📚 Pokretanje Projekta

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ili venv\Scripts\activate na Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### .env (primjer)

```
DATABASE_URL=postgresql://avnadmin:...@pg-...aivencloud.com:24805/defaultdb?sslmode=require
SECRET_KEY=super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

#### .env.local (primjer)

```
NEXT_PUBLIC_API_URL=https://webshop-qz8k.onrender.com
```

---

## 💰 Entiteti

### Product

* id, name, description, price, image\_url, quantity, date\_posted, status, seller\_id

### Order

* id, user\_id, status, date\_created, date\_accepted/rejected/completed, items: \[product\_id, quantity, price]

### CartItem

* id, user\_id, product\_id, quantity

---

---

## 📚 GitHub

* Source code (frontend + backend u istom repou): [https://github.com/nedim53/Webshop](https://github.com/nedim53/Webshop)

Repozitorij sadrži dvije zasebne mape:

```
/Webshop
 ├── frontend   # Next.js aplikacija
 └── backend    # FastAPI servis
```

---
🧭 TOK APLIKACIJE
🧑‍💼 1. ADMIN PANEL – Tok rada
🟢 Pristup sistemu
Admin se prijavljuje putem /login forme s emailom i lozinkom (admin@gmail.com / 123456).

Nakon uspješne prijave dobija JWT token koji se sprema u localStorage.

🗂️ Navigacija
Nakon prijave automatski se preusmjerava na /admin/dashboard.

Navigacija omogućava pristup:

✅ Početnoj stranici (pregled proizvoda)

✅ Dodavanje proizvoda

✅ Pregled narudžbi

✅ Logout

📦 Upravljanje proizvodima
Admin vidi listu svih proizvoda (status, količina, cijena...).

Može filtrirati i sortirati proizvode po nazivu, cijeni, datumu...

Može:

➕ Dodati novi proizvod

📝 Urediti postojeći proizvod

🗑️ Obrisati proizvod

📋 Upravljanje narudžbama
Pregled svih narudžbi koje su poslali korisnici.

Klikom na narudžbu vidi detalje: ime kupca, artikli, adresa, status...

Može promijeniti status narudžbe: pending → accepted / rejected / completed.

🧑‍🛒 2. KORISNIK (Guest) – Tok rada
🟠 Početni prikaz
Nepotpisani korisnik (guest) otvara /.

Prikazuju se svi proizvodi sa statusom approved.

Može koristiti filtriranje i pretragu.

🔍 Detalji proizvoda
Klikom na proizvod otvara se /product/[id].

Prikaz: slika, opis, cijena, dostupna količina.

Može kliknuti "Dodaj u korpu".

🛒 Korpa
Korpa se čuva po korisniku.

Korisnik može povećati količinu ili obrisati proizvod.

Klikom na “Kreiraj narudžbu” otvara se forma.

📝 Kreiranje narudžbe
Unosi podatke: ime, prezime, adresa, telefon.

Klikom na “Pošalji narudžbu”:

kreira se narudžba

status automatski pending

admin je može kasnije prihvatiti ili odbiti

🧾 Registrovani korisnik (opcionalno)
Može se registrovati putem forme /register.

Nakon registracije može se prijaviti i naručivati kao prijavljeni korisnik.

🧑‍💻 3. BACKEND – Procesi iza kulisa
FastAPI servis povezan s PostgreSQL bazom.

Svi podaci o korisnicima, proizvodima, korpi, narudžbama čuvaju se u bazi.

Backend koristi JWT za autentikaciju.

Route-ovi su zaštićeni i odgovarajuća rola ima pristup samo odgovarajućem dijelu.

GET /products/ prikazuje samo odobrene proizvode (za goste).

GET /orders/user/{email} koristi se za prikaz korisničkih narudžbi.

✅ Dodatne napomene
Aplikacija je potpuno responzivna – funkcioniše na mobitelu i desktopu.

Admin i korisnici imaju različite UI komponente i rute.

Deployment frontend i backend su odvojeni:

Frontend: https://webshop-neptis.vercel.app

Backend API: https://webshop-qz8k.onrender.com

## 🚀 Napomena

Status narudžbe se ručno mijenja od strane admina. Registrovani korisnici mogu sami dodavati artikle kao prodavci (slično OLX-u).

Svi zahtjevi iz dokumentacije su pokriveni i funkcionalnost testirana.
