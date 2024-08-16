'use client'
import useAuthCheck from '../utils/useAuthCheck';

export default function page() {

  const loading = useAuthCheck();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex justify-center h-screen items-center'>
      <a href='/manage-menu' className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Button
      </a>
    </div>
  )
}
