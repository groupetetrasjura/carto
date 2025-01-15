import { Box, useMediaQuery, useTheme } from "@mui/material";
import { CSSProperties } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LayersIcon from "@mui/icons-material/Layers";

export const Legend = () => {
  //   const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  //   const toggleLegend = () => {
  //     setIsVisible(!isVisible);
  //     setIsCollapsed(false);
  //   };

  const tabletStyle: CSSProperties = {
    position: "absolute",
    top: 12,
    left: 24,
    borderRadius: "5px",
    overflow: "hidden",
    width: "90%",
  };

  const desktopStyle: CSSProperties = {
    position: "absolute",
    bottom: 12,
    left: 96,
    overflow: "hidden",
    borderRadius: "5px",
  };

  const legendContent = (
    <>
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
    </>
  );

  return (
    <Accordion style={isTablet ? tabletStyle : desktopStyle} defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <LayersIcon style={{ marginRight: "5px", color: "grey" }} />
        <Typography component="span" variant="button">
          Légende et couches
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{legendContent}</AccordionDetails>
    </Accordion>
  );
};
