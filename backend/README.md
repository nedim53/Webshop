# Neptis Backend

Backend aplikacija za e-commerce platformu napisana u FastAPI-u.

## Instalacija

1. **Klonirajte repozitorij**
```bash
git clone <repository-url>
cd backend
```

2. **Kreirajte virtualno okruženje**
```bash
python -m venv venv
```

3. **Aktivirajte virtualno okruženje**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Instalirajte dependencies**
```bash
pip install -r requirements.txt
```

5. **Konfigurirajte bazu podataka**
- Kreirajte PostgreSQL bazu podataka
- Kopirajte `env.example` u `.env`
- Ažurirajte podatke za konekciju na bazu podataka

## Pokretanje aplikacije

### Development server (preporučeno)
```bash
python run.py
```

### Ili direktno sa uvicorn
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Dokumentacija

Nakon pokretanja servera, možete pristupiti:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Struktura projekta

```
backend/
├── app/
│   ├── controllers/     # API endpoints
│   ├── core/           # Konfiguracija i database
│   ├── models/         # SQLAlchemy modeli
│   ├── repositories/   # Data access layer
│   ├── schemas/        # Pydantic modeli
│   ├── services/       # Business logic
│   └── main.py         # Aplikacija entry point
├── requirements.txt    # Production dependencies
└── requirements-dev.txt # Development dependencies
```

## Development

### Instalacija development dependencies
```bash
pip install -r requirements-dev.txt
```

### Pokretanje testova
```bash
pytest
```

### Formatiranje koda
```bash
black .
isort .
```

### Linting
```bash
flake8
```

## Environment Variables

Kreirajte `.env` fajl sa sljedećim varijablama:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Baza podataka

Baza podataka se automatski kreira kada se aplikacija pokrene prvi put. SQLAlchemy će kreirati sve tabele na osnovu definisanih modela. 