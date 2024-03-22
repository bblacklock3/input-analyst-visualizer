import React, { useEffect, useMemo } from "react";
import TypingPlot from "../components/plots/TypingPlot";
import WeeklyTypingPlot from "../components/plots/WeeklyTypingPlot";
import { useState } from "react";
import {
  startOfDay,
  endOfDay,
  addDays,
  toStrNoTimezone,
  addHours,
} from "../utils/timeConversions";
import TypingSpeedPlot from "../components/plots/TypingSpeedPlot";
import {
  Heading,
  VStack,
  Stack,
  HStack,
  Text,
  Button,
  Icon,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import "react-day-picker/dist/style.css";
import DataWindowPlot from "./plots/DataWindowPlot";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import KeypressCard from "./cards/DailySummary";
import DailySummary from "./cards/DailySummary";
import HoursCalendar from "./cards/HoursCalendar";
import WeeklySummaryPlot from "./plots/WeeklySummaryPlot";
import { EARLIEST_DATE } from "../utils/constants";
import {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { HiPlay } from "react-icons/hi";
import { HiPlayPause } from "react-icons/hi2";

type DataStatus = {
  date: string;
  status: string;
  summary: string;
};

function createDateArray(startDate: number) {
  let newDateArray = [];
  for (let i = 0; i < 7; i++) {
    const start = addDays(startDate, -i);
    const end = addDays(start, 1);
    newDateArray.push({ startTime: start, endTime: end });
  }
  return newDateArray.reverse();
}

function calcStartDate(endDate: number, pageIndex: number, pageSize: number) {
  const pageOffset = pageIndex * pageSize + pageSize;
  return addDays(endDate, -pageOffset);
}

const KeyboardAnalyst = () => {
  //data and fetching state
  const [data, setData] = useState<DataStatus[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [processButton, setProcessButton] = useState(false);

  const handleProcessAll = async () => {
    setIsLoading(true);
    const url = new URL("http://localhost:8000/analysis/process/all");
    const response = await fetch(url.href, {
      method: "POST",
    });
    const json = await response.json();
    setIsLoading(false);
    getUnprocessedDates();
  };

  const getUnprocessedDates = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    const url = new URL("http://localhost:8000/analysis/unprocessed/");
    try {
      const response = await fetch(url.href);
      const json = (await response.json()) as any;
      console.log(json);
      setData(json);
    } catch (error) {
      setIsError(true);
      console.error(error);
      return;
    }
    setIsError(false);
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    getUnprocessedDates();
  }, []);

  const columns = useMemo<MRT_ColumnDef<DataStatus>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.date,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: false,
      density: "compact",
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(9, 107, 226, 0.1)"
            : "rgba(0,0,0,0.1)",
      }),
    }),
    renderDetailPanel: ({ row }: any) => (
      <Box>
        <Text>{row.original.summary}</Text>
      </Box>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const unprocessedDates = data.filter(
    (d) => d.status === "Unprocessed"
  ).length;

  const unprocessedHeading = isLoading
    ? "Processing Dates..."
    : "Unprocessed Dates: " + unprocessedDates;

  return (
    <VStack>
      <HStack>
        <Heading color={"#ffffff"} fontSize={24}>
          {unprocessedDates > 0 ? unprocessedHeading : "All Dates Processed"}
        </Heading>
        <Button
          variant={"outline"}
          size="md"
          onClick={handleProcessAll}
          isLoading={isLoading}
        >
          <Icon boxSize={6} as={HiPlay} color={"#ffffff"} />
        </Button>
      </HStack>
      <ThemeProvider theme={theme}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </VStack>
  );
};

export default KeyboardAnalyst;
