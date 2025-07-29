import { NextRequest, NextResponse } from 'next/server';

// GET - dohvati admin-ove narudžbe
export async function GET(request: NextRequest) {
  try {
    // Dohvati token iz Authorization header-a
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Autorizacija je obavezna' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Dohvati podatke o korisniku da vidimo da li je admin
    const userResponse = await fetch('http://localhost:8000/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Neispravan token' },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    
    // Provjeri da li je admin
    if (!userData.is_admin) {
      return NextResponse.json(
        { error: 'Pristup odbijen - samo admin može pristupiti' },
        { status: 403 }
      );
    }

    // Dohvati admin-ove narudžbe
    const response = await fetch(`http://localhost:8000/orders/admin/${userData.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Greška pri dohvatanju admin-ovih narudžbi' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 