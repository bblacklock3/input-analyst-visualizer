import { Button, HStack, VStack } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Plot from "react-plotly.js";

const X_MAX = 3440;
const Y_MAX = 1440;

const MouseAnalyst = () => {
  const [mouseData, setMouseData] = React.useState<any>([]);
  const [mouseDataLength, setMouseDataLength] = React.useState<number>(1000);

  function handleSetMouseData(data: any) {
    data.filter((d: any) => {
      return d.y > Y_MAX || d.y < 0 || d.x > X_MAX || d.x < 0;
    });
    data.forEach((d: any) => {
      d.y = Y_MAX - d.y;
    });
    const pixelGrid = 10;
    const pixelAverage = 100;
    const Y_LEN = Math.round(Y_MAX / pixelGrid);
    const X_LEN = Math.round(X_MAX / pixelGrid);
    let density = new Array(Y_LEN).fill(0).map(() => new Array(X_LEN).fill(0));
    for (let i = 0; i < X_LEN; i++) {
      for (let j = 0; j < Y_LEN; j++) {
        const points = data.filter((d: any) => {
          const dist = Math.sqrt(
            (d.x - i * pixelGrid) ** 2 + (d.y - j * pixelGrid) ** 2
          );
          return dist < pixelAverage;
        });
        density[j][i] = points
          .map((d: any) => {
            const dist = Math.sqrt(
              (d.x - i * pixelGrid) ** 2 + (d.y - j * pixelGrid) ** 2
            );
            return 1 - dist / pixelAverage;
          })
          .reduce((a: any, b: any) => a + b, 0);
      }
    }
    console.log(density);
    const x_grid = new Array(X_LEN).fill(0).map((_, i) => i * pixelGrid);
    const y_grid = new Array(Y_LEN).fill(0).map((_, i) => i * pixelGrid);
    setMouseData({ x_grid, y_grid, density });
  }

  return (
    <VStack>
      <Plot
        data={[
          {
            x: mouseData.x_grid,
            y: mouseData.y_grid,
            z: mouseData.density,
            type: "contour",
            contours: {
              coloring: "heatmap",
            },
            line: {
              width: 0,
              smoothing: 0.5,
            },
            
            colorscale: [
              [0, "rgb(255, 255, 255)"],
              [0.25, "rgb(31,120,180)"],
              [0.5, "rgb(51,160,44)"],
              [0.75, "rgb(255, 204, 0)"],
              [1, "rgb(227,26,28)"],
            ],
          },
        ]}
        
        layout={{
          width: X_MAX * 0.4,
          height: Y_MAX * 0.4,
          title: "Mouse Data",
          plot_bgcolor: "#1a202c00",
          paper_bgcolor: "#1a202c00",
          xaxis: {
            range: [0, X_MAX],
            autorange: false,
          },
          yaxis: {
            range: [0, Y_MAX],
            autorange: false,
          },
        }}
        config={{
          staticPlot: true,
        }}
      />
      <HStack>
        <Button
          onClick={() => {
            fetch(`http://localhost:8000/data/mouse-data/`)
              .then((response) => response.json())
              .then((data) => handleSetMouseData(data))
              .catch((error) => console.log(error));
          }}
        >
          Fetch Mouse Data
        </Button>
        <NumberInput
          defaultValue={1000}
          value={mouseDataLength}
          onChange={(value) => setMouseDataLength(parseInt(value))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </VStack>
  );
};

export default MouseAnalyst;
