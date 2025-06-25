import { Box } from "@mui/material";

export const MaptilerIcon = () => {
  return (
    <Box
      component="a"
      href="https://www.maptiler.com"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 999,
        display: "inline-block",
      }}
    >
      <img
        src="https://api.maptiler.com/resources/logo.svg"
        alt="MapTiler logo"
        style={{ height: 25, width: "auto" }}
      />
    </Box>
  );
};
