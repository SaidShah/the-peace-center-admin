import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Settings from "./components/Settings";
import { db } from "./js/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adhanTimes, setAdhanTimes] = useState<{
    data?: { timings?: Record<string, string> };
  }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [iqamaData, setIqamaData] = useState<any>({});
  const [fajrIqama, setFajrIqama] = useState(0);
  const [dhuhrIqama, setDhuhrIqama] = useState(0);
  const [asrIqama, setAsrIqama] = useState(0);
  const [maghribIqama, setMaghribIqama] = useState(0);
  const [ishaIqama, setIshaIqama] = useState(0);

  useEffect(() => {
    const fetchAdhanTimes = () => {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()}`;

      const requestOptions = {
        method: "GET",
        redirect: "follow" as RequestRedirect,
      };

      fetch(
        `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=Carlisle%2C+Pennsylvania%2C+US&method=2&shafaq=general&tune=0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0&school=0&midnightMode=0&timezonestring=America%2FNew_York&latitudeAdjustmentMethod=3&calendarMethod=UAQ`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => setAdhanTimes(JSON.parse(result)))
        .catch((error) => console.error(error));
    };

    setCurrentTime(new Date());
    fetchAdhanTimes();
  }, []);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "salah"));
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setIqamaData(data[0]);
      } catch (error) {
        console.error("Error fetching Firebase data:", error);
      }
    };

    fetchFirebaseData();
  }, []);

  useEffect(() => {
    if (iqamaData) {
      if (typeof iqamaData.fajr === "number") setFajrIqama(iqamaData.fajr);
      if (typeof iqamaData.dhuhr === "number") setDhuhrIqama(iqamaData.dhuhr);
      if (typeof iqamaData.asr === "number") setAsrIqama(iqamaData.asr);
      if (typeof iqamaData.maghrib === "number")
        setMaghribIqama(iqamaData.maghrib);
      if (typeof iqamaData.isha === "number") setIshaIqama(iqamaData.isha);
    }
  }, [iqamaData]);

  function addMinutesAndRoundToNearest5(
    time: string,
    minAdd: number,
    maxAdd: number
  ) {
    const [hours, minutes] = time.split(":").map(Number);
    // Add a random number between minAdd and maxAdd
    const add = Math.floor(Math.random() * (maxAdd - minAdd + 1)) + minAdd;
    let totalMinutes = hours * 60 + minutes + add;

    // Round up to the next 0 or 5
    let roundedMinutes = Math.ceil(totalMinutes / 5) * 5;

    // Return just the number of minutes to add (rounded)
    return roundedMinutes - (hours * 60 + minutes);
  }

  const handleIqamaToggle = async () => {
    const goingToManual = !iqamaData.is_manual_iqama;

    setIqamaData((prevData: any) => ({
      ...prevData,
      is_manual_iqama: goingToManual,
    }));

    let timings = adhanTimes?.data?.timings;
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings || {};

    if (!goingToManual) {
      const fajrMinutesToAdd = addMinutesAndRoundToNearest5(Fajr, 20, 25);
      const dhuhrMinutesToAdd = addMinutesAndRoundToNearest5(Dhuhr, 20, 25);
      const asrMinutesToAdd = addMinutesAndRoundToNearest5(Asr, 20, 25);
      const maghribMinutesToAdd = addMinutesAndRoundToNearest5(Maghrib, 10, 15);
      const ishaMinutesToAdd = addMinutesAndRoundToNearest5(Isha, 10, 15);

      if (iqamaData?.id) {
        try {
          await updateDoc(doc(db, "salah", iqamaData.id), {
            fajr: fajrMinutesToAdd,
            dhuhr: dhuhrMinutesToAdd,
            asr: asrMinutesToAdd,
            maghrib: maghribMinutesToAdd,
            isha: ishaMinutesToAdd,
            is_manual_iqama: false,
          });

          setFajrIqama(fajrMinutesToAdd);
          setDhuhrIqama(dhuhrMinutesToAdd);
          setAsrIqama(asrMinutesToAdd);
          setMaghribIqama(maghribMinutesToAdd);
          setIshaIqama(ishaMinutesToAdd);
        } catch (error) {
          console.error("Error updating iqama times:", error);
        }
      }
    } else {
      if (iqamaData?.id) {
        try {
          await updateDoc(doc(db, "salah", iqamaData.id), {
            is_manual_iqama: true,
          });
        } catch (error) {
          console.error("Error updating manual flag:", error);
        }
      }
    }

    console.log(iqamaData)
  };

  const handleLoginUser = (email: string, password: string) => {
    if (email.toLocaleLowerCase() !== "abc") {
      setIsEmailError(true);
      return;
    } else if (isEmailError) {
      setIsEmailError(false);
    }

    if (password !== "abc") {
      setIsPasswordError(true);
      return;
    } else if (isPasswordError) {
      setIsPasswordError(false);
    }

    const days = 360;
    const expires = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `masjid-assakina-admin=true; path=/; expires=${expires}`;
    setIsLoggedIn(true);
  };

  useEffect(() => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    }

    const adminCookie = getCookie("masjid-assakina-admin");
    if (adminCookie) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleSaveSettings = async () => {
    if (!iqamaData?.id) {
      alert("No document ID found for updating!");
      return;
    }
    try {
      await updateDoc(doc(db, "salah", iqamaData.id), {
        is_manual_iqama: iqamaData.is_manual_iqama,
        fajr: fajrIqama,
        dhuhr: dhuhrIqama,
        asr: asrIqama,
        maghrib: maghribIqama,
        isha: ishaIqama,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div>
        {isLoggedIn ? (
          <>
            <Settings
              iqamaData={iqamaData}
              adhanTimes={adhanTimes}
              currentTime={currentTime}
              handleIqamaToggle={handleIqamaToggle}
              fajrIqama={fajrIqama}
              setFajrIqama={setFajrIqama}
              dhuhrIqama={dhuhrIqama}
              setDhuhrIqama={setDhuhrIqama}
              asrIqama={asrIqama}
              setAsrIqama={setAsrIqama}
              maghribIqama={maghribIqama}
              setMaghribIqama={setMaghribIqama}
              ishaIqama={ishaIqama}
              setIshaIqama={setIshaIqama}
            />
            <div style={{ textAlign: "center", padding: "2%" }}>
              <Button
                onClick={handleSaveSettings}
                style={{ fontSize: "1.5rem", padding: "20px" }}
                size="large"
                variant="contained"
              >
                Save Settings
              </Button>
            </div>
          </>
        ) : (
          <Login
            handleLoginUser={handleLoginUser}
            isEmailError={isEmailError}
            isPasswordError={isPasswordError}
          />
        )}
      </div>
    </>
  );
}

export default App;
