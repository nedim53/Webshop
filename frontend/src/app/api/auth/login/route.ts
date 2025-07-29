import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i lozinka su obavezni' },
        { status: 400 }
      );
    }

    // Poziv prave backend API rute
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Neispravni podaci za prijavu' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      return NextResponse.json({
        token: data.access_token,
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          role: userData.is_admin ? 'admin' : 'user',
          firstName: userData.first_name,
          lastName: userData.last_name,
          city: userData.city,
          country: userData.country,
          phone: userData.phone,
        }
      });
    }

    return NextResponse.json({
      token: data.access_token,
      user: {
        role: 'user', 
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 