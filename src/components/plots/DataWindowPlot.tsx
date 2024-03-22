import { useEffect, useState } from "react";
import { Box, Button, Center, HStack, VStack, Text } from "@chakra-ui/react";
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
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { arrayRange, countEvents } from "../../utils/keyboardMetrics";
import { toStrNoTimezone } from "../../utils/timeConversions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  startTime: number;
  endTime: number;
  timeResolution: number;
  averageWindow: number;
}

const DataWindowPlot = ({
  startTime,
  endTime,
  timeResolution,
  averageWindow,
}: IProps) => {
  const [plotData, setPlotData] = useState<any>({
    timeArray: [],
    keypresses: [],
    clicks: [],
  });

  async function handleKeypressData() {
    const startStr = `start_date=${toStrNoTimezone(startTime)}`;
    const endStr = `end_date=${toStrNoTimezone(endTime)}`;
    const timeArray = arrayRange(startTime, endTime, timeResolution);

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
    setPlotData(() => {
      return {
        timeArray,
        keypresses,
        clicks,
      };
    });
  }
  useEffect(() => {
    handleKeypressData();
  }, [startTime, endTime, averageWindow]);

  const data = {
    labels: plotData.timeArray,
    datasets: [
      {
        label: "Clicks",
        data: plotData.clicks,
        fill: true,
        pointRadius: 0,
        backgroundColor: "#3ab740a3",
        borderColor: "#3bea47ff",
      },
      {
        label: "Keypresses",
        data: plotData.keypresses,
        fill: true,
        pointRadius: 0,
        backgroundColor: "#3a6cb7a3",
        borderColor: "#3b81eaff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        min: startTime,
        max: endTime,
        type: "time" as const,
        adapters: {
          date: {
            locale: enUS,
          },
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
          source: "auto" as const,
          autoSkip: true,
          maxTicksLimit: 16,
          color: "white",
        },
      },
      y: {
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
    },
  };

  defaults.font.family = "Arial Black";
  defaults.font.size = 16;
  defaults.animation = false;

  return (
    <Box w={"1000px"}>
      <Line data={data} options={options}></Line>
    </Box>
  );
};

export default DataWindowPlot;
