import "../styles/Settings.css";
import React, { useEffect } from "react";
import { Typography, Switch, Grid, TextField, Button } from "@mui/material";

type IqamaData = {
  is_manual_iqama?: boolean;
  fajr?: number;
  dhuhr?: number;
  asr?: number;
  maghrib?: number;
  isha?: number;
};

interface SettingsProps {
  adhanTimes: { data?: { timings?: { [key: string]: string } } };
  currentTime: Date;
  iqamaData: IqamaData;
  handleIqamaToggle: () => void;
  fajrIqama?: number;
  setFajrIqama?: React.Dispatch<React.SetStateAction<number>>;
  dhuhrIqama?: number;
  setDhuhrIqama?: React.Dispatch<React.SetStateAction<number>>;
  asrIqama?: number;
  setAsrIqama?: React.Dispatch<React.SetStateAction<number>>;
  maghribIqama?: number;
  setMaghribIqama?: React.Dispatch<React.SetStateAction<number>>;
  ishaIqama?: number;
  setIshaIqama?: React.Dispatch<React.SetStateAction<number>>;
}

const Settings = ({
  adhanTimes,
  currentTime,
  iqamaData,
  handleIqamaToggle,
  fajrIqama,
  setFajrIqama,
  dhuhrIqama,
  setDhuhrIqama,
  asrIqama,
  setAsrIqama,
  maghribIqama,
  setMaghribIqama,
  ishaIqama,
  setIshaIqama,
}: SettingsProps) => {
  let timings = adhanTimes?.data?.timings;

  const prayerKeys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const toArabic = (prayerName: string) => {
    switch (prayerName) {
      case "Fajr":
        return "الفجر";
      case "Dhuhr":
        return "الظهر";
      case "Asr":
        return "العصر";
      case "Maghrib":
        return "المغرب";
      case "Isha":
        return "العشاء";
      case "Jummah":
        return "جمعة";
    }
  };

  const convertTo12HourFormat = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const formattedTimings = timings
    ? Object.entries(timings)
        .filter(([key]) => prayerKeys.includes(key))
        .map(([key, value]) => ({
          name: toArabic(key),
          time: convertTo12HourFormat(value),
          nameEn: key,
        }))
    : [];

  const currentTimeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleToggle = () => {
    handleIqamaToggle && handleIqamaToggle();
  };

  const addMinutes = (time: string, minutesToAdd: number) => {

    const [hours, minutes] = time.split(":").map((value) => parseInt(value, 10));
  
    const totalMinutes = minutes + minutesToAdd;
    const newHours = (hours + Math.floor(totalMinutes / 60)) % 24; // Handle hour overflow
    const newMinutes = totalMinutes % 60; // Remaining minutes after overflow
  
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  };

          //   useEffect(() => {
          //   if (iqamaData) {
          //     if (setFajrIqama) setFajrIqama(iqamaData.fajr ?? 0);
          //     if (setDhuhrIqama) setDhuhrIqama(iqamaData.dhuhr ?? 0);
          //     if (setAsrIqama) setAsrIqama(iqamaData.asr ?? 0);
          //     if (setMaghribIqama) setMaghribIqama(iqamaData.maghrib ?? 0);
          //     if (setIshaIqama) setIshaIqama(iqamaData.isha ?? 0);
          //   }
          // }, []);

  return (
    <div>
      <Typography variant="h2" color="#e1c027" className="current_time">
        {currentTimeString}
      </Typography>
      <div>
        <div className="iqama-type-container">
          <p className="iqama-label">Auto Iqama</p>
          <Switch
            onChange={handleToggle}
            checked={!!iqamaData.is_manual_iqama}
            color="warning"
            size="medium"
          />
          <p className="iqama-label">Manual Iqama</p>
        </div>
      </div>

      {formattedTimings &&
        formattedTimings.length > 0 &&
        formattedTimings.map((timing, index) => {
          // Map the English prayer name to the correct value and setter
          let value = 0;
          let setValue: ((v: number) => void) | undefined = undefined;
          switch (timing.nameEn) {
            case "Fajr":
              value = fajrIqama ?? 0;
              setValue = setFajrIqama;
              break;
            case "Dhuhr":
              value = dhuhrIqama ?? 0;
              setValue = setDhuhrIqama;
              break;
            case "Asr":
              value = asrIqama ?? 0;
              setValue = setAsrIqama;
              break;
            case "Maghrib":
              value = maghribIqama ?? 0;
              setValue = setMaghribIqama;
              break;
            case "Isha":
              value = ishaIqama ?? 0;
              setValue = setIshaIqama;
              break;
          }

          // useEffect(() => {
          //   if (iqamaData) {
          //     if (setFajrIqama) setFajrIqama(iqamaData.fajr ?? 0);
          //     if (setDhuhrIqama) setDhuhrIqama(iqamaData.dhuhr ?? 0);
          //     if (setAsrIqama) setAsrIqama(iqamaData.asr ?? 0);
          //     if (setMaghribIqama) setMaghribIqama(iqamaData.maghrib ?? 0);
          //     if (setIshaIqama) setIshaIqama(iqamaData.isha ?? 0);
          //   }
          // }, [
          //   iqamaData,
          //   setFajrIqama,
          //   setDhuhrIqama,
          //   setAsrIqama,
          //   setMaghribIqama,
          //   setIshaIqama,
          // ]);

          return (
            <Grid
              key={index}
              container
              spacing={2}
              style={{
                textAlign: "center",
                border: "5px solid #fff",
                fontWeight: "bold",
                padding: "20px",
                margin: "20px",
              }}
            >
              <Grid size={3}>
                <h1>{timing.name}</h1>
              </Grid>
              <Grid size={3}>
                <h1>{timing.nameEn}</h1>
              </Grid>
              <Grid size={3}>
                <h1>Salah Time: {timing.time}</h1>
              </Grid>
              <Grid size={3}>
                <TextField
                  className="login-textfield"
                  disabled={!iqamaData.is_manual_iqama}
                  type="number"
                  size="medium"
                  id="filled-basic"
                  label="Iqama Minutes"
                  variant="filled"
                  placeholder="iqama minutes"
                  value={value}
                  onChange={(e) => setValue && setValue(Number(e.target.value))}
                />
                <Grid size={12}>
                  <h1>Iqama Time: {addMinutes(timing.time, value)}</h1>
                </Grid>
              </Grid>
            </Grid>
          );
        })}
    </div>
  );
};

export default Settings;
