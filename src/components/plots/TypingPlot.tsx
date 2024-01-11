import { useEffect, useState } from "react";
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
  timeLimit?: number;
}

const TypingPlot = (props: IProps) => {
  const [plotData, setPlotData] = useState<any>({
    x: [],
    y: [],
  });

  const startDatetime = props.startTime;
  const endDatetime = props.endTime;
  const timeResolution = 60 * 1000; // 1 sec
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
        const smaWindow = 10;
        //t = t.slice(smaWindow - 1);
        //totalKeypresses = sma(totalKeypresses, smaWindow);
        if (props.timeLimit) {
          let limitedKeypresses = [];
          for (let i = 0; i < t.length; i++) {
            limitedKeypresses.push(
              timestamps.filter((d: any) => {
                if (props.timeLimit) {
                  return d > t[i + 1] - props.timeLimit && d < t[i + 1];
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

  return (
    <>
      <Plot
        data={[
          {
            x: plotData.x,
            y: plotData.y,
            type: "scatter",
            mode: "lines",
            fill: "tozeroy",
          },
        ]}
        layout={{
          plot_bgcolor: "#1a202c00",
          paper_bgcolor: "#1a202c00",
          autosize: false,
          width: 1000,
          height: 250,
          margin: {
            l: 40,
            r: 0,
            b: 40,
            t: 0,
          },
          xaxis: {
            type: "date",
            color: "#ffffffff",
            tickformat: "%I %p",
            nticks: 10,
            tickfont: {
              size: 14,
              color: "#ffffffff",
            },
            gridcolor: "#1a202c00",
          },
          yaxis: {
            color: "#ffffffff",
            gridcolor: "#1a202c00",
          },
        }}
        config={{
          staticPlot: true,
        }}
      />
    </>
  );
};

export default TypingPlot;
