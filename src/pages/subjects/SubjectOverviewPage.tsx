import {
  AddRounded,
  BookRounded,
  DashboardRounded,
  GradingRounded,
  GridOffRounded,
  StorefrontRounded,
  SubjectRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Grid2,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { SingleElement } from "../../components/Elements/SingleElement";
import { ActionElement } from "../../components/Elements/ActionElement";
import { SearchElement } from "../../components/Elements/SearchElement";
import { SubjectsGrid } from "./SubjectsGrid";

export function SubjectOverviewPage() {
  const location = useLocation();

  const numberOfSubjects = 12; //replace with backend from store

  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbs = [
    <Link
      key="1"
      component={RouterLink}
      to="/dashboard"
      underline="hover"
      color="inherit"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <DashboardRounded />
      Dashboard
    </Link>,
    ...pathnames.map((value, index) => {
      const last = index === pathnames.length - 1;
      const to = `/${pathnames.slice(0, index + 1).join("/")}`;

      return last ? (
        <Typography key={to} color="text.primary">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Typography>
      ) : (
        <Link
          key={to}
          component={RouterLink}
          to={to}
          underline="hover"
          color="inherit"
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Link>
      );
    }),
  ];

  const handleCreateSubject = () => {
    console.log("Create Subject");
  };
  const handleOpenSubjectMarketplace = () => {
    console.log("Open Subject Marketplace");
  };
  const handleSearch = (value: string) => {
    console.log("Search value:", value);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        p: 3,
        gap: 2,
      }}
    >
      {/* Page header */}
      <Paper
        variant="elevation"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Typography variant="h4">Subjects - Overview</Typography>
      </Paper>
      <Grid2
        container
        spacing={2}
        rowGap={2}
        columns={{ xs: 4, sm: 6, md: 9, lg: 12, xl: 15 }}
        sx={{
          width: "100%",
        }}
      >
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<SubjectRounded />}
            title="Total Subjects"
            value={numberOfSubjects}
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<GradingRounded />}
            title="Learned Subjects"
            value={numberOfSubjects}
            textColor="success"
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <SingleElement
            icon={<GridOffRounded />}
            title="Unlearned Subjects"
            value={numberOfSubjects}
            textColor="warning"
          />
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <SearchElement onSearch={handleSearch} placeholder="Search Subjects..."/>
        </Grid2>
        <Grid2 size={{ xs: 4, sm: 3, md: 6, lg: 6, xl: 9 }}>
          <ActionElement
            icon={<BookRounded sx={{ color: "#c28cf3", fontSize: 24 }} />}
            title="Manage Subjects"
            // Button 1
            button1Text="Create Subject"
            button1Icon={<AddRounded />}
            onButton1Click={handleCreateSubject}
            button1Variant="contained"
            button1Color="success"
            // Button 2
            button2Text="Subject Marketplace"
            button2Icon={<StorefrontRounded />}
            onButton2Click={handleOpenSubjectMarketplace}
            button2Variant="outlined"
            button2Color="secondary"
          />
        </Grid2>
        <Grid2 size={15} sx = {{}}>
            <SubjectsGrid />
        </Grid2>
      </Grid2>
    </Box>
  );
}
