'use client';
import { loginUser } from "../lib/actions";
import { serialize } from 'cookie';
export default function Home() {
  const handleSubmit = async (e: React.FormEvent) => {    
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const response = await loginUser(formData);
    
    if (!response) {
      console.log('error');
    } else {
      // Guardar el token en la cookie
      document.cookie = serialize('token', response.hashedCredentials, {
        httpOnly: false, // Para el cliente
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      });

      // Redirigir al usuario
      window.location.href = '/manage-menu';
    }
    
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="" />
        <input type="password" name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="" />
        <input type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded" />
      </form>
    </main>
  );
}
