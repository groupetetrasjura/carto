import React from "react";
import Button from "@mui/material/Button";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useMediaQuery } from "@mui/material";

const MapFiltersButtons = ({
  openMultiStepForm,
}: {
  openMultiStepForm: (step: number) => void;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <Button
        variant="brownMain"
        startIcon={<LandscapeIcon />}
        onClick={() => openMultiStepForm(0)} // Open form at step 1
      >
        Massifs
      </Button>
      <Button
        variant="brownMain"
        startIcon={<DirectionsWalkIcon />}
        onClick={() => openMultiStepForm(1)} // Open form at step 2
      >
        {isMobile ? "Mode de dépl." : "Mode de déplacement"}
      </Button>
      <Button
        variant="brownMain"
        startIcon={<CalendarTodayIcon />}
        onClick={() => openMultiStepForm(2)} // Open form at step 3
      >
        Date
      </Button>
    </div>
  );
};

export default MapFiltersButtons;
