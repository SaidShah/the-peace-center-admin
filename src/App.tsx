import './App.css'
import Header from './components/Header'
import Login from './components/Login'
import CircularProgress from '@mui/material/CircularProgress';
import Settings from './components/Settings';
import { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adhanTimes, setAdhanTimes] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchAdhanTimes = () => {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

      const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect
      };

      fetch(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=Carlisle%2C+Pennsylvania%2C+US&method=2&shafaq=general&tune=0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0&school=0&midnightMode=0&timezonestring=America%2FNew_York&latitudeAdjustmentMethod=3&calendarMethod=UAQ`, requestOptions)
        .then((response) => response.text())
        .then((result) => setAdhanTimes(JSON.parse(result)))
        .catch((error) => console.error(error));
    };

    setCurrentTime(new Date());
    fetchAdhanTimes();
  }, [])

  const handleLoginUser = (email: string, password: string) => {
    if(email !== "abc") {
      setIsEmailError(true);
    }

    if(password !== "abc") {
      setIsPasswordError(true);
    }

    const days = 360;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `masjid-assakina-admin=true; path=/; expires=${expires}`;
    setIsLoggedIn(true);
  }

    useEffect(() => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    }

    const adminCookie = getCookie('masjid-assakina-admin');
    if (adminCookie) {
      setIsLoggedIn(true);
    }
    
    setLoading(false);
  }, []);

if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress color="primary" />
    </div>
  );
}

  return (
    <>
    <Header />
     <div>
      {
        isLoggedIn ?
        <Settings adhanTimes={adhanTimes} currentTime={currentTime} />
        :
        <Login handleLoginUser={handleLoginUser} isEmailError={isEmailError} isPasswordError={isPasswordError}/>
      }
     </div>
    </>
  )
}

export default App
