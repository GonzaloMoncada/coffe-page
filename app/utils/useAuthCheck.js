// hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import auth from '../lib/actions';
const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      await checkCookieAndRedirect();
      setLoading(false);
    };

    performAuthCheck();
  }, []);

  return loading;
};
async function checkCookieAndRedirect() {
    const cookieValue = getCookie('token');
    
    if (cookieValue) {
      const isCookieValid = await auth(cookieValue);
      if (!isCookieValid) {
          window.location.href = '/'; // Redirige si la cookie es inválida
        } 
    } else {
      window.location.href = '/'; // Redirige si no hay cookie
    }
  }

export default useAuthCheck;
