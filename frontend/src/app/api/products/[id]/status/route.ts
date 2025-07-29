import { NextRequest, NextResponse } from 'next/server';

// PUT - ažuriraj status proizvoda
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validacija
    if (!status) {
      return NextResponse.json(
        { error: 'Status je obavezan' },
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

    // Provjeri da li je korisnik admin
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
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
        { error: 'Samo administrator može mijenjati status proizvoda' },
        { status: 403 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}/status`, {
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
        { error: errorData.detail || 'Greška pri ažuriranju statusa proizvoda' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);

  } catch (error) {
    console.error('Product status update error:', error);
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    );
  }
} 