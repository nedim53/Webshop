import { NextRequest, NextResponse } from 'next/server';

// GET - dohvati pojedinačni proizvod
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    const response = await fetch(`http://localhost:8000/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Proizvod nije pronađen' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);

  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
}

// PUT - ažuriraj proizvod
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;
    const body = await request.json();
    const { name, description, price, image_url, quantity } = body;

    // Validacija
    if (!name || !price || !quantity) {
      return NextResponse.json(
        { error: 'Naziv, cijena i količina su obavezni' },
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

    const response = await fetch(`http://localhost:8000/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        image_url,
        quantity: parseInt(quantity),
        seller_id: 1, // Dodajemo seller_id
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri ažuriranju proizvoda' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);

  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
}

// DELETE - obriši proizvod
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    // Dohvati token iz Authorization header-a
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Autorizacija je obavezna' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch(`http://localhost:8000/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { detail: 'Greška pri brisanju proizvoda' };
      }
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri brisanju proizvoda' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Proizvod uspješno obrisan' });

  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 