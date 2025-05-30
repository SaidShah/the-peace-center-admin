import "../styles/Settings.css"
import { Typography, Switch } from "@mui/material";

interface SettingsProps {
  adhanTimes: { data?: { timings?: { [key: string]: string } } };
  currentTime: Date;
}

const Settings = ({ adhanTimes, currentTime }: SettingsProps) => {
  let timings = adhanTimes?.data?.timings;
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings || {};

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
    ? Object.entries(timings).map(([key, value]) => ({
        name: toArabic(key),
        time: convertTo12HourFormat(value),
        nameEn: key,
      }))
    : [];

  const currentTimeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Switch toggled:", !event.target.checked);
  };

  return (
    <div>
      <Typography
        variant="h2"
        color="#e1c027"
        className="current_time"
      >
        {currentTimeString}
      </Typography>
      <div>
        <div className="iqama-type-container">
          <p className="iqama-label">Auto Iqama</p>
          <Switch onChange={handleToggle} color="warning" size="medium" />
          <p className="iqama-label">Manual Iqama</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
