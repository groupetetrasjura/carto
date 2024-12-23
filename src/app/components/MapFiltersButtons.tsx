import React from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckIcon from "@mui/icons-material/Check";

import { useMediaQuery } from "@mui/material";

import {
  useMapFiltersSelectedDate,
  useMapFiltersSelectedTransport,
  useMapFiltersSelectedZones,
} from "@/app/lib/stores/mapFilters";

const MapFiltersButtons = ({
  openMultiStepForm,
}: {
  openMultiStepForm: (step: number) => void;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const selectedZones = useMapFiltersSelectedZones();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedDate = useMapFiltersSelectedDate();

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <Badge
        color="success"
        badgeContent={<CheckIcon fontSize={"inherit"} />}
        // variant="dot"
        invisible={!Boolean(selectedZones.length > 0)}
      >
        <Button
          variant="brownMain"
          startIcon={<LandscapeIcon />}
          onClick={() => openMultiStepForm(0)} // Open form at step 1
          sx={{ textTransform: "none" }}
        >
          Massifs{" "}
        </Button>
      </Badge>
      <Badge
        color="success"
        // badgeContent={<CheckIcon fontSize={"inherit"} />}
        variant="dot"
        invisible={!Boolean(selectedTransport)}
      >
        <Button
          variant="brownMain"
          startIcon={<DirectionsWalkIcon />}
          onClick={() => openMultiStepForm(1)} // Open form at step 2
          sx={{ textTransform: "none" }}
        >
          {isMobile ? "Dépl." : "Mode de déplacement"}
        </Button>
      </Badge>
      <Badge
        color="success"
        // badgeContent={<CheckIcon fontSize={"inherit"} />}
        variant="dot"
        invisible={!Boolean(selectedDate)}
      >
        <Button
          variant="brownMain"
          startIcon={<CalendarTodayIcon />}
          onClick={() => openMultiStepForm(2)} // Open form at step 3
          sx={{ textTransform: "none" }}
        >
          Date
        </Button>
      </Badge>
    </div>
  );
};

export default MapFiltersButtons;
