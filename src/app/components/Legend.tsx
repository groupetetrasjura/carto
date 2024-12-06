import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LayersIcon from "@mui/icons-material/Layers";
import IconButton from "@mui/material/IconButton";

export const Legend = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const toggleLegend = () => {
    setIsVisible(!isVisible);
    setIsCollapsed(false);
  };

  const legendContent = (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!isTablet && (
          <Typography variant="inherit" fontSize={"14px"}>
            {`Légende`}
          </Typography>
        )}
        {!isTablet && (
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small">
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        )}
      </Box>

      {(!isTablet && !isCollapsed) || isTablet ? (
        <Box>
          Itinéraires autorisés:
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Box
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#0288d1",
                marginRight: 10,
              }}
            ></Box>
            <span>{`Du 15/12 au 14/05`}</span>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Box
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#0F9D58",
                marginRight: 10,
              }}
            ></Box>
            <span>{`Du 15/12 au 30/06`}</span>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Box
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#F57C00",
                marginRight: 10,
              }}
            ></Box>
            <span>{`Du 15/05 au 30/06`}</span>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Box
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#673AB7",
                marginRight: 10,
              }}
            ></Box>
            <span>{`Du 15/12 au 1er dimanche de mars`}</span>
          </Box>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Box
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#9E9E9E",
                marginRight: 10,
              }}
            ></Box>
            <span>{`Non réglementé par l'APPB / Si déneigé`}</span>
          </Box>
        </Box>
      ) : null}
    </>
  );

  if (isTablet) {
    return (
      <>
        <IconButton
          onClick={toggleLegend}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <LayersIcon />
        </IconButton>
        {isVisible && (
          <Box
            style={{
              position: "fixed",
              bottom: 80,
              right: 20,
              maxWidth: "calc(100% - 40px)",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            {legendContent}
          </Box>
        )}
      </>
    );
  }

  return (
    <Box
      style={{
        position: "absolute",
        bottom: 10,
        left: 20,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        maxHeight: isCollapsed ? "60px" : "300px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
        zIndex: 1000,
      }}
    >
      {legendContent}
    </Box>
  );
};
