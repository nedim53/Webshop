import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, first_name, last_name, city, country, phone } = await request.json();

    // Validacija obaveznih polja
    if (!username || !email || !password || !first_name || !last_name || !city || !country || !phone) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Lozinka mora imati najmanje 6 karaktera' },
        { status: 400 }
      );
    }

    // Poziv prave backend API rute
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name,
        last_name,
        city,
        country,
        phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri registraciji' },
        { status: response.status }
      );
    }

    const userData = await response.json();
    
    return NextResponse.json({
      message: 'Registracija uspješna',
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        city: userData.city,
        country: userData.country,
        phone: userData.phone,
        is_admin: userData.is_admin,
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 