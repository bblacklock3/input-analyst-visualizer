import { isSameDay } from "date-fns";
import { useEffect } from "react";
import Calendar from "react-calendar";
import { addDays, addHours, startOfDay } from "../../utils/timeConversions";

interface IProps {
  dateArray: { startTime: number; endTime: number }[] | {};
  timeResolution: number;
  inactiveTime: number;
}

const todayDate = addHours(startOfDay(Date.now()), 3);
const lastWeekDate = addDays(todayDate, -7);
const datesToAddContentTo = [todayDate, lastWeekDate];

function tileContent({ date, view }: { date: Date; view: string }) {
  // Add class to tiles in month view only
  if (view === "month") {
    // Check if a date React-Calendar wants to check is on the list of dates to add class to
    if (datesToAddContentTo.find((dDate) => isSameDay(dDate, date))) {
      return "My content";
    }
  }
}

const HoursCalendar = ({ dateArray, timeResolution, inactiveTime }: IProps) => {
  return (
    <Calendar
      onChange={() => {
        console.log("changed");
      }}
      value={new Date()}
      tileContent={tileContent}
    />
  );
};

export default HoursCalendar;
