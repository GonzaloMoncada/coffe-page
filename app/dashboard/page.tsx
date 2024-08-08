'use client'    
import { useEffect, useState } from 'react';
import useAuthCheck from '../utils/useAuthCheck';

export default function page() {
  const loading = useAuthCheck();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>page</div>
  )
}
