import { Box, Typography } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";

export const Legend = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        maxHeight: isCollapsed ? "60px" : "300px", // Limite la hauteur quand replié
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="inherit" fontSize={"14px"}>
          {`Légende`}
        </Typography>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small">
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {!isCollapsed && (
        <>
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
        </>
      )}
    </Box>
  );
};
