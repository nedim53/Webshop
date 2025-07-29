import { NextRequest, NextResponse } from 'next/server';

// GET - dohvati sve proizvode
export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://localhost:8000/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Greška pri dohvatanju proizvoda' },
        { status: response.status }
      );
    }

    const products = await response.json();
    return NextResponse.json(products);

  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
}

// POST - kreiraj novi proizvod
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, image_url, quantity } = body;

    // Validacija
    if (!name || !price || !quantity) {
      return NextResponse.json(
        { error: 'Naziv, cijena i količina su obavezni' },
        { status: 400 }
      );
    }

    const response = await fetch('http://localhost:8000/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        image_url,
        quantity: parseInt(quantity),
        seller_id: 1, // Default seller_id - može se promeniti kasnije
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri kreiranju proizvoda' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);

  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 