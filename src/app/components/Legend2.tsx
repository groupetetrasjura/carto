import Image from "next/image";
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
        <span>
          <strong>Itinéraires autorisés</strong>
        </span>
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
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "#084aff",
              backgroundColor: "transparent",
              marginRight: 5,
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
              backgroundColor: "#084aff",
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
              backgroundColor: "#ed9e00",
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
              backgroundColor: "#ff0000",
              marginRight: 10,
            }}
          ></Box>
          <span>{`Du 15/12 au 1er dimanche de mars`}</span>
        </Box>
        <Box
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <Box
            style={{
              width: 20,
              height: 3,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "#ff0000",
              backgroundColor: "transparent",
              marginRight: 5,
            }}
          ></Box>
          <span>{`Non réglementé par l'APPB`}</span>
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
          <span>{`Si déneigé`}</span>
        </Box>
        <Box>
          <span>
            <strong>Autres informations</strong>
          </span>
        </Box>
        <Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Image
              src="/icons/parking_marker.png"
              alt="Parking Icon"
              width={20}
              height={20}
              style={{ marginRight: 10 }}
            />
            <span>Parking à proximité</span>
          </Box>
        </Box>
        <Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <svg width="21" height="21">
              <rect
                width="21"
                height="21"
                fill="#E6E6FA"
                stroke="#4B0082"
                strokeWidth="1"
              />
            </svg>
            <span style={{ marginLeft: 10 }}>
              Autres Arrêtés Préfectoraux de Protection de Biotopes
            </span>
          </Box>
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
