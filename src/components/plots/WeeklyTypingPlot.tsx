import { useState } from "react";
import { Box, Button, Center, HStack, VStack, Text } from "@chakra-ui/react";
import Plot from "react-plotly.js";
import { DB_URL } from "../../utils/constants";
import sma from "../../utils/sma";

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
  timescale: number;
}

const WeeklyTypingPlot = (props: IProps) => {
  const [plotData, setPlotData] = useState<any>({
    x: [],
    y: [],
  });
  const [updatingData, setUpdatingData] = useState<any>({
    x: [],
    y: [],
  });

  const startDatetime = props.startTime;
  const endDatetime = props.endTime;
  const dates = arrayRange(
    new Date(startDatetime).getTime(),
    new Date(endDatetime).getTime(),
    24 * 60 * 60 * 1000
  ).map((d) => {
    return new Date(d).toISOString().slice(0, 10);
  });

  async function handleKeypressData() {
    dates.forEach((d: any, idx: number) => {
      let startStr = `start_date=${d}`;
      let endStr = "";
      if (idx === dates.length - 1) {
        startStr = `start_date=${d}`;
      } else {
        startStr = `start_date=${d}`;
        endStr = `&end_date=${dates[idx + 1]}`;
      }
      fetch(`${DB_URL}data/keyboard-data/keypresses/?${startStr}${endStr}`)
        .then((res) => res.json())
        .then((data: any) => {
          setUpdatingData((prev: any) => {
            const x = prev.x;
            const y = prev.y;
            x[idx] = new Date(d).toISOString().slice(0, 10);
            y[idx] = data.total;
            console.log(x, y);
            return { x, y };
          });
        });
    });
    setPlotData(() => updatingData);
  }

  return (
    <>
      <Plot
        data={[
          {
            x: plotData.x,
            y: plotData.y,
            type: "bar",
            marker: {
              color: "rgb(158,202,225)",
              line: {
                color: "rgb(8,48,107)",
                width: 1.5,
              },
            },
          },
        ]}
        layout={{
          datarevision: plotData,
          plot_bgcolor: "#1a202c00",
          paper_bgcolor: "#1a202c00",
          xaxis: {
            type: "date",
            color: "#ffffffff",
            tickfont: {
              size: 16,
              color: "#ffffffff",
            },
            gridcolor: "#1a202c00",
          },
          yaxis: {
            color: "#ffffffff",
            gridcolor: "#1a202c00",
            tickfont: {
              size: 16,
              color: "#ffffffff",
            },
          },
        }}
        config={{
          staticPlot: true,
        }}
      />
      <Button mt={10} onClick={handleKeypressData}>
        Fetch Data
      </Button>
    </>
  );
};

export default WeeklyTypingPlot;
