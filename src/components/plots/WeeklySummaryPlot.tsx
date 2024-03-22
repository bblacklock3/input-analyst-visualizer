import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  VStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { DB_URL } from "../../utils/constants";
import sma from "../../utils/sma";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
import { defaults } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line, Bar, Chart } from "react-chartjs-2";
import {
  arrayRange,
  countEvents,
  getActiveTime,
} from "../../utils/keyboardMetrics";
import { startOfDay, toStrNoTimezone } from "../../utils/timeConversions";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const defaultPlotData = {
  dates: [],
  totalKeypresses: [],
  totalClicks: [],
  totalTime: [],
};

interface IProps {
  dateArray: { startTime: number; endTime: number }[];
  timeResolution: number;
  inactiveTime: number;
}

const DataWindowPlot = ({
  dateArray,
  timeResolution,
  inactiveTime,
}: IProps) => {
  const [plotData, setPlotData] = useState<any>(defaultPlotData);

  const getTime = (
    timeArray: any,
    clicks: any,
    keypresses: any,
    timeResolution: any
  ): any => {
    const total = getActiveTime(timeArray, clicks, keypresses, timeResolution);
    const keyboard = getActiveTime(
      timeArray,
      keypresses,
      keypresses,
      timeResolution
    );
    const mouse = getActiveTime(timeArray, clicks, clicks, timeResolution);
    return { total, keyboard, mouse };
  };

  async function getDataCount(
    timeArray: number[],
    startTime: number,
    endTime: number,
    averageWindow: number
  ) {
    const startStr = `start_date=${toStrNoTimezone(startTime)}`;
    const endStr = `end_date=${toStrNoTimezone(endTime)}`;

    const keypresses = await fetch(
      `${DB_URL}data/keyboard-data/?${startStr}&${endStr}`
    )
      .then((res) => {
        return res.ok ? res.json() : [];
      })
      .then((data: any) => {
        return countEvents(timeArray, data, averageWindow);
      });
    const clicks = await fetch(
      `${DB_URL}data/mouse-data/?${startStr}&${endStr}`
    )
      .then((res) => {
        return res.ok ? res.json() : [];
      })
      .then((data: any) => {
        return countEvents(timeArray, data, averageWindow);
      });
    return [keypresses, clicks];
  }

  async function calculateDailySummary(
    timeArray: number[],
    startTime: number,
    endTime: number
  ) {
    const [activeKeypresses, activeClicks] = await getDataCount(
      timeArray,
      startTime,
      endTime,
      inactiveTime
    );
    const activeTime = getTime(
      timeArray,
      activeClicks,
      activeKeypresses,
      timeResolution
    );
    const [totalKeypressesArray, totalClicksArray] = await getDataCount(
      timeArray,
      startTime,
      endTime,
      24 * 60 * 60 * 1000
    );
    const totalKeypresses = Math.max(...totalKeypressesArray);
    const totalClicks = Math.max(...totalClicksArray);
    return {
      totalKeypresses,
      totalClicks,
      activeTime,
    };
  }

  async function createPlotData() {
    let datesArray: Date[] = [];
    let totalKeypressesArray: number[] = [];
    let totalClicksArray: number[] = [];
    let totalTimeArray: number[] = [];

    for (let i = 0; i < dateArray.length; i++) {
      const date = dateArray[i];
      const startTime = date.startTime;
      const endTime = date.endTime;
      const timeArray = arrayRange(startTime, endTime, timeResolution);
      const { totalKeypresses, totalClicks, activeTime } =
        await calculateDailySummary(timeArray, startTime, endTime);
      datesArray[i] = new Date(startOfDay(startTime));
      totalKeypressesArray[i] = totalKeypresses;
      totalClicksArray[i] = totalClicks;
      totalTimeArray[i] = activeTime.total;
    }
    setPlotData(() => {
      return {
        dates: datesArray,
        totalKeypresses: totalKeypressesArray,
        totalClicks: totalClicksArray,
        totalTime: totalTimeArray,
      };
    });
  }

  useEffect(() => {
    createPlotData();
  }, [dateArray, inactiveTime]);

  console.log(plotData);

  const barData = {
    labels: plotData.dates,
    datasets: [
      {
        data: plotData.totalTime,
        type: "line" as const,
        label: "Active Time",
        fill: false,
        pointRadius: 5,
        backgroundColor: "#2d6fadc8",
        borderColor: "#00cceb",
        yAxisID: "y1",
      },
      {
        data: plotData.totalClicks,
        type: "bar" as const,
        label: "Clicks",
        backgroundColor: "#3ab740a3",
        borderColor: "#3bea47ff",
        yAxisID: "y",
      },
      {
        data: plotData.totalKeypresses,
        type: "bar" as const,
        label: "Keypresses",
        backgroundColor: "#3a6cb7a3",
        borderColor: "#3b81eaff",
        yAxisID: "y",
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
        },
        border: {
          display: false,
        },
        grid: {
          display: false,
          color: "#3a6cb7a3",
          zeroLineColor: "#eb0000",
        },
        ticks: {
          maxTicksLimit: 7,
          color: "white",
        },
      },
      y: {
        position: "left" as const,
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: "#3a6cb7ff",
          zeroLineColor: "#eb0000",
        },
        ticks: {
          source: "auto" as const,
          autoSkip: true,
          maxTicksLimit: 8,
          color: "#ffffffff",
        },
      },
      y1: {
        position: "right" as const,
        grid: {
          display: false,
        },
        ticks: {
          source: "auto" as const,
          autoSkip: true,
          maxTicksLimit: 8,
          color: "#ffffffff",
        },
      },
    },
  };

  defaults.font.family = "Arial Black";
  defaults.font.size = 16;
  defaults.animation = false;
  const weeklyTotalTime = plotData.totalTime.reduce(
    (a: any, b: any) => a + b,
    0
  );
  const weeklyTotalKeypresses = plotData.totalKeypresses.reduce(
    (a: any, b: any) => a + b,
    0
  );
  const weeklyTotalClicks = plotData.totalClicks.reduce(
    (a: any, b: any) => a + b,
    0
  );

  return (
    <VStack w={"1000px"}>
      <Text color={"white"} fontSize={20} fontWeight={"bold"}>
        Weekly Summary: {weeklyTotalTime.toFixed(2)} hrs, {weeklyTotalClicks}{" "}
        clicks, {weeklyTotalKeypresses} keypresses
      </Text>
      <Chart type="bar" data={barData} options={barOptions}></Chart>
    </VStack>
  );
};

export default DataWindowPlot;
