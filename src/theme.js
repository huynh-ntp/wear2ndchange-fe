import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // green color
    },
    secondary: {
      main: "#ff5722",
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
