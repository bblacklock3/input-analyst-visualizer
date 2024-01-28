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

const arrayRange = (start: number, stop: number, step: number) => {
  console.log(stop - start, step);
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
};

interface IProps {
  startTime: string;
  endTime: string;
  timeWindow?: number;
}

const DataWindowPlot = (props: IProps) => {
  const [plotData, setPlotData] = useState<any>({
    x: [],
    y: [],
  });

  const startDatetime = props.startTime;
  const endDatetime = props.endTime;
  const timeResolution = 60 * 1000; // 1 min
  const smaWindow = 1;
  const totalPixelWidth = 1200;

  function handleKeypressData() {
    const startStr = `start_date=${startDatetime}`;
    const endStr = `end_date=${endDatetime}`;

    fetch(`${DB_URL}data/keyboard-data/?${startStr}&${endStr}`)
      .then((res) => res.json())
      .then((data: any) => {
        let timestamps: number[] = [];
        data.forEach((d: any) => {
          timestamps.push(new Date(d.timestamp).getTime());
        });
        timestamps.reverse();
        let t = arrayRange(
          timestamps[0],
          timestamps[timestamps.length - 2],
          timeResolution
        );
        let totalKeypresses = [];
        let keypresses = 0;
        for (let i = 0; i < t.length; i++) {
          keypresses += timestamps.filter((d: any) => {
            return d > t[i] && d < t[i + 1];
          }).length;
          totalKeypresses.push(keypresses);
        }
        t = t.slice(smaWindow - 1);
        totalKeypresses = sma(totalKeypresses, smaWindow);
        if (props.timeWindow) {
          let limitedKeypresses = [];
          for (let i = 0; i < t.length; i++) {
            limitedKeypresses.push(
              timestamps.filter((d: any) => {
                if (props.timeWindow) {
                  return d > t[i + 1] - props.timeWindow && d < t[i + 1];
                }
              }).length
            );
          }
          setPlotData({
            x: t,
            y: limitedKeypresses,
          });
        } else {
          setPlotData({
            x: t,
            y: totalKeypresses,
          });
        }
      });
  }
  useEffect(() => {
    handleKeypressData();
  }, [props.startTime, props.endTime]);

  const data = {
    labels: plotData.x,
    datasets: [
      {
        label: "Keypresses",
        data: plotData.y,
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

  return (
    <Box w={"1000px"}>
      <Line data={data} options={options}></Line>
    </Box>
  );
};

export default DataWindowPlot;
