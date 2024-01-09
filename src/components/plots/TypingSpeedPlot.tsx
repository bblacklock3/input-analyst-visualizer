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

const filterZero = (time: any, data: any) => {
  let filterIdx: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0) {
      filterIdx.push(i);
    }
  }
  time = time.filter((d: any, idx: number) => !filterIdx.includes(idx));
  data = data.filter((d: any, idx: number) => !filterIdx.includes(idx));
};

interface IProps {
  startTime: string;
  endTime: string;
  timescale: number;
}

const KeypressGraph = (props: IProps) => {
  const [plotData, setPlotData] = useState<any>({
    x: [],
    y: [],
    activePeriods: [],
    activeTime: [],
    activeWidth: [],
  });

  const startDatetime = props.startTime;
  const endDatetime = props.endTime;
  const timescaleSec = props.timescale;
  const timeResolution = 10 * 1000; // 1 sec
  const totalPixelWidth = 1200;

  function getActivePeriods(data: any, minLen: number, minGap: number) {
    let activePeriods: any[] = [];
    let activePeriod: any[] = [];
    let lastActive = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0) {
        activePeriod.push(i);
        lastActive = i;
      } else {
        if (
          activePeriod.filter((a: any) => data[a] !== 0).length > minLen &&
          i - lastActive > minGap
        ) {
          activePeriods.push(activePeriod);
          activePeriod = [];
        } else {
          if (activePeriod.includes(lastActive)) activePeriod.push(i);
        }
      }
    }
    return activePeriods;
  }

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
        console.log(t);
        let typingSpeed = [];
        for (let i = 0; i < t.length; i++) {
          const keypresses = timestamps.filter((d: any) => {
            return d > t[i] && d < t[i + 1];
          }).length;
          typingSpeed.push((keypresses / timeResolution) * 1000);
        }
        const smaWindow = 5;
        t = t.slice(smaWindow - 1);
        typingSpeed = sma(typingSpeed, smaWindow);
        const activePeriods = getActivePeriods(typingSpeed, 10 * 6, 1 * 6);
        let activeTime = 0;
        activePeriods.forEach((d: any) => {
          activeTime += d.length;
        });
        const activeWidth = activePeriods.map((d: any) =>
          Math.round((totalPixelWidth * d.length) / activeTime)
        );
        console.log(t, typingSpeed, activePeriods, activeTime, activeWidth);
        setPlotData({
          x: t,
          y: typingSpeed,
          activePeriods,
          activeTime,
          activeWidth,
        });
      });
  }

  const dividerMarkup = (width: number) => {
    return (
      <Box
        position={"absolute"}
        ml={`-${width}px`}
        w={`${width}px`}
        h={"100%"}
        bg={"#ffffff"}
      />
    );
  };

  const plotMarkup = (idx: number, width: number, ml: number) => {
    const x = plotData.x.filter((d: any, i: number) =>
      plotData.activePeriods[idx].includes(i)
    );
    const y = plotData.y.filter((d: any, i: number) =>
      plotData.activePeriods[idx].includes(i)
    );
    return (
      <Box position={"relative"}>
        {dividerMarkup(1)}
        <Plot
          data={[
            {
              x,
              y,
              type: "scatter",
              mode: "lines",
              fill: "tozeroy",
            },
          ]}
          layout={{
            plot_bgcolor: "#1a202c00",
            paper_bgcolor: "#1a202c00",
            autosize: false,
            margin: {
              l: ml,
              r: 0,
              b: 1,
              t: 0,
            },
            width,
            xaxis: {
              type: "date",
              color: "#ffffff00",
              gridcolor: "#1a202c00",
              showticklabels: false,
            },
            yaxis: {
              color: "#ffffff00",
              gridcolor: "#1a202c00",
              range: [0, 4],
            },
          }}
          config={{
            staticPlot: true,
          }}
        />
        <VStack>
          <Text fontSize="md" color="#ffffff" fontWeight={"bold"}>
            {new Date(x[0]).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text fontSize="md" color="#ffffff" fontWeight={"bold"}>
            {new Date(x[x.length - 1]).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      <HStack ml={10}>
        {plotData.activeWidth.map((width: any, idx: any) => {
          console.log(width);
          if (idx === 0) {
            return plotMarkup(idx, width + 20, 0);
          } else {
            return plotMarkup(idx, width, 0);
          }
        })}
      </HStack>
      <Button mt={10} onClick={handleKeypressData}>
        Fetch Data
      </Button>
    </>
  );
};

export default KeypressGraph;
