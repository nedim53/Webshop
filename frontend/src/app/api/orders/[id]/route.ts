import { NextRequest, NextResponse } from 'next/server';

// PUT - promijeni status narudžbe
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { status } = body;

    // Validacija
    if (!status) {
      return NextResponse.json(
        { error: 'Status je obavezan' },
        { status: 400 }
      );
    }

    // Dohvati token iz Authorization header-a
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Autorizacija je obavezna' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Provjeri da li je korisnik admin
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
    if (!userData.is_admin) {
      return NextResponse.json(
        { error: 'Samo administrator može mijenjati status narudžbi' },
        { status: 403 }
      );
    }

    const response = await fetch(`http://localhost:8000/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri promjeni statusa narudžbe' },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);

  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 