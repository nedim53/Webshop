import { NextRequest, NextResponse } from 'next/server';

// DELETE - ukloni stavku iz korpe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { productId } = body;

    // Validacija
    if (!productId) {
      return NextResponse.json(
        { error: 'ID proizvoda je obavezan' },
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

    const response = await fetch(`http://localhost:8000/cart/${userId}/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Greška pri uklanjanju stavke' },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: 'Stavka uspješno uklonjena' });

  } catch (error) {
    console.error('Cart remove error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 