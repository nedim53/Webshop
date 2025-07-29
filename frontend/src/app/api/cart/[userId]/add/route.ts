import { NextRequest, NextResponse } from 'next/server';

// POST - dodaj stavku u korpu
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { productId, quantity } = body;

    // Validacija
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'ID proizvoda i količina su obavezni' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Autorizacija je obavezna' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri dodavanju u korpu' },
        { status: response.status }
      );
    }

    const cartItem = await response.json();
    return NextResponse.json(cartItem);

  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 