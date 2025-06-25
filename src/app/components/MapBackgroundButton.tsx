import {
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { CSSProperties, useState, useEffect, useRef } from "react";


import Typography from "@mui/material/Typography";
import LayersIcon from "@mui/icons-material/Layers";
import CheckIcon from "@mui/icons-material/Check";
import {
  useActiveMapBackground,
  useMapFiltersActions,
  useMaptilerMapId,
} from "@/app/lib/stores/mapFilters";
import { MapBackground } from "../lib/types/mapFilters";

interface MapBackgroundButtonProps {
  onClick?: () => void;
}

export const MapBackgroundButton: React.FC<MapBackgroundButtonProps> = ({
  onClick,
}) => {
  const [isOpenMapBackgrounds, setIsOpenMapBackgrounds] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { setActiveMapBackground } = useMapFiltersActions();
  const activeMapBackground = useActiveMapBackground();
  const maptilerMapId = useMaptilerMapId();

  const legendRef = useRef<HTMLDivElement>(null);
  const mapBackgroundRef = useRef<HTMLDivElement>(null);

  const toggleMapBackgrounds = () => {
    setIsOpenMapBackgrounds(!isOpenMapBackgrounds);
    if (onClick) onClick(); // Trigger the onClick callback if provided
  };

  const handleBackgroundChange = (background: MapBackground) => {
    setActiveMapBackground(background);
  };

  const modalStyleMapBackgrounds: CSSProperties = {
    position: "absolute",
    bottom: isTablet ? 180 : 140,
    right: isTablet ? 24 : 12,
    borderRadius: "5px",
    width: "200px",
    display: isOpenMapBackgrounds ? "block" : "none",
  };

  const buttonStyle: CSSProperties = {
    position: "absolute",
    bottom: isTablet ? 125 : 80,
    right: 12,
    backgroundColor: "white",
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  };

  const mapBackgrounds = (
    <Box ref={mapBackgroundRef}>
      {[
        {
          id: "dynamic",
          label: "Dynamique (Maptiler Landscape + IGN SCAN 25®)",
        },
        { id: "ign-layer", label: "IGN SCAN 25®" },
        { id: "outdoor-v2", label: "Maptiler Outdoor" },
        { id: "streets-v2", label: "Maptiler Streets" },
        { id: "landscape", label: "Maptiler Landscape" },
      ].map((background) => (
        <Box
          key={background.id}
          onClick={() => handleBackgroundChange(background.id as MapBackground)}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            cursor: "pointer",
            backgroundColor:
              (activeMapBackground || maptilerMapId) === background.id
                ? "#f5f5f5"
                : "transparent",
            padding: isTablet ? "3px" : "5px",
            borderRadius: "4px",
            color: "#000",
          }}
        >
          <Box style={{ width: 24, display: "flex", justifyContent: "center" }}>
            {(activeMapBackground || maptilerMapId) === background.id && (
              <CheckIcon
                style={{ color: theme.palette.brown.main, fontSize: 20 }}
              />
            )}
          </Box>
          <span style={{ marginLeft: 5 }}>{background.label}</span>
        </Box>
      ))}
    </Box>
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      legendRef.current &&
      !legendRef.current.contains(event.target as Node) &&
      mapBackgroundRef.current &&
      !mapBackgroundRef.current.contains(event.target as Node)
    ) {
      setIsOpenMapBackgrounds(false);
    }
  };
  // close element Legend and mapBackgrounds if click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <IconButton
        onClick={toggleMapBackgrounds}
        style={buttonStyle}
        sx={{
          color: "#725E51",
          backgroundColor: "white",
          padding: 2,
          "&:hover": {
            backgroundColor: "white", // No effect on hover
          },
        }}
      >
        <LayersIcon />
      </IconButton>
      <Box
        ref={mapBackgroundRef}
        style={{
          ...modalStyleMapBackgrounds,
          backgroundColor: "white",
          padding: 5,
        }}
      >
        <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          <LayersIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography
            component="span"
            variant="button"
            fontSize={"14px"}
            color="#434A4A"
          >
            Fonds de carte
          </Typography>
        </Box>
        {mapBackgrounds}
      </Box>

    </>
  );
};

export default MapBackgroundButton;
