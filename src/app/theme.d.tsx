import "@mui/material/styles";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface Palette {
    brown: Palette["primary"];
    green: Palette["primary"];
  }

  interface PaletteOptions {
    brown?: PaletteOptions["primary"];
    green?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    greenMain: true;
    brownMain: true;
  }
}
