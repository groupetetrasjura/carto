"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    brown: {
      main: "#725E51",
      light: "#DBC4AD",
      dark: "#4A392C",
    },
    green: {
      main: "#A2BE73",
      light: "#CCD8B8",
      dark: "#5A7037",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "greenMain" },
          style: {
            backgroundColor: "#A2BE73",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#5A7037",
            },
          },
        },
        {
          props: { variant: "brownMain" },
          style: {
            backgroundColor: "#FFFFFF",
            color: "#725E51",
            "&:hover": {
              backgroundColor: "#4A392C",
              color: "#FFFFFF",
            },
          },
        },
      ],
    },
  },
});

export default theme;
