import {
  Box,
  Typography,
  Paper,
  Grid2,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  ChartsGrid,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
} from "@mui/x-charts";
import { useState } from "react";
type Timeframe = "daily" | "weekly" | "monthly" | "total";

const mockData: Record<Timeframe, { x: string[]; y: number[] }> = {
  daily: {
    x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    y: [2, 4, 5, 3, 7, 8, 6],
  },
  weekly: { x: ["Week 1", "Week 2", "Week 3", "Week 4"], y: [10, 20, 15, 25] },
  monthly: {
    x: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    y: [30, 40, 45, 50, 55, 60],
  },
  total: { x: ["Start", "Current"], y: [0, 100] },
};
const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const handleChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value as Timeframe);
  };
  console.log("Chart Data:", mockData[timeframe].x);

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Dashboard
      </Typography>

      <Grid2
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="stretch"
      >
        {/* Mock Widgets */}
        <Grid2 size={{ xs: 2, sm: 4, md: 3 }}>
          <Paper
            sx={{ height: "100%", padding: "1.5rem", textAlign: "center" }}
          >
            <Typography variant="h6">Learnt This Week</Typography>
            <Typography variant="h3">5h</Typography>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 2, sm: 4, md: 3 }}>
          <Paper
            sx={{ height: "100%", padding: "1.5rem", textAlign: "center" }}
          >
            <Typography variant="h6">Total Progress</Typography>
            <Typography variant="h3">60%</Typography>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 2, sm: 4, md: 3 }}>
          <Paper
            sx={{ height: "100%", padding: "1.5rem", textAlign: "center" }}
          >
            <Typography variant="h6">Upcoming Deadlines</Typography>
            <Typography variant="h3">3</Typography>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 2, sm: 4, md: 3 }}>
          <Paper
            sx={{ height: "100%", padding: "1.5rem", textAlign: "center" }}
          >
            <Typography variant="h6">Total Study Time</Typography>
            <Typography variant="h3">35h</Typography>
          </Paper>
        </Grid2>

        <Grid2 size={12}>
          <FormControl fullWidth variant="filled">
            <InputLabel id="timeframe-select-label">
              Select Timeframe
            </InputLabel>
            <Select
              labelId="timeframe-select-label"
              id="timeframe-select"
              value={timeframe}
              label="Select Timeframe"
              onChange={handleChange}
            >
              <MenuItem value="daily">Daily Progress</MenuItem>
              <MenuItem value="weekly">Weekly Progress</MenuItem>
              <MenuItem value="monthly">Monthly Progress</MenuItem>
              <MenuItem value="total">Total Progress</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={12}>
          <Paper
            sx={{
              width: "100%",
              height: "40dvh", // Make the parent container have a responsive height
              padding: "1rem",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Study
              Progress
            </Typography>
            <ResponsiveChartContainer
              // 1) Put axis keys inside each series object
              series={[
                {
                  type: "line",
                  data: mockData[timeframe].y,
                  xAxisKey: "x-axis",
                  yAxisKey: "y-axis",
                },
              ]}
              // 2) Define xAxis (with a matching 'id') for your string categories
              xAxis={[
                {
                  id: "x-axis",
                  data: mockData[timeframe].x,
                  scaleType: "band",
                },
              ]}
              // 3) Define yAxis (with a matching 'id') for numeric values
              yAxis={[
                {
                  id: "y-axis",
                },
              ]}
            >
              <ChartsGrid vertical horizontal />
              <ChartsTooltip />
              <LinePlot />

              {/* <MarkPlot /> adds data markers for the same line series */}
              <MarkPlot />

              {/* Render the axes, referencing the same IDs */}
              <ChartsXAxis axisId="x-axis" label="Time" position="bottom" />
              <ChartsYAxis axisId="y-axis" label="Progress" position="left" />
            </ResponsiveChartContainer>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DashboardPage;
