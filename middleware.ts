import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Obtén el valor de la cookie como una cadena de texto
  const cookie = request.cookies.get('token')?.value;
  if (!cookie) {
    // Redirigir a la página de inicio si no hay cookie
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Verificar la validez de la cookie
  const isAuthenticated = await checkCookie(cookie);

  if (!isAuthenticated) {
    // Redirigir a la página de inicio si la cookie no es válida
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Permitir el acceso a la página
  return NextResponse.next();
}

// Función para verificar la cookie a través de la API
async function checkCookie(cookie: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cookie }),
    });
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Error checking cookie:', error);
    return false;
  }
}

export const config = {
  matcher: ['/manage-menu/:path*'], // Cambia esto según tus rutas
};
