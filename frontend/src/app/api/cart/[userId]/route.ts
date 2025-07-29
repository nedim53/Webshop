import { NextRequest, NextResponse } from 'next/server';

// GET - dohvati korpu korisnika
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Autorizacija je obavezna' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch(`http://localhost:8000/cart/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Greška pri dohvatanju korpe' },
        { status: response.status }
      );
    }

    const cart = await response.json();
    return NextResponse.json(cart);

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 