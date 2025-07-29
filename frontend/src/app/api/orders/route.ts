import { NextRequest, NextResponse } from 'next/server';

// GET - dohvati sve narudžbe (za admin) ili narudžbe korisnika
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
    const isAdmin = userData.is_admin;

    let ordersUrl = 'http://localhost:8000/orders/';
    
    // Ako nije admin, dohvati samo narudžbe tog korisnika
    if (!isAdmin) {
      ordersUrl = `http://localhost:8000/orders/user/${userData.email}`;
    }

    const response = await fetch(ordersUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Greška pri dohvatanju narudžbi' },
        { status: response.status }
      );
    }

    const orders = await response.json();
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
}

// POST - kreiraj novu narudžbu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, address, phone, email, items } = body;

    // Validacija
    if (!customer_name || !address || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Svi podaci o kupcu i stavke su obavezni' },
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

    // Dohvati ID korisnika
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
    const userId = userData.id;

    // Kreiraj narudžbu
    const response = await fetch(`http://localhost:8000/orders/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer_name,
        address,
        phone,
        email,
        items: items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri kreiranju narudžbe' },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);

  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 