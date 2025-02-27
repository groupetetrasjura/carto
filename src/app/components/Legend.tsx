import Image from "next/image";
import { Box, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { CSSProperties, useState } from "react";
import MapIcon from "@mui/icons-material/Map";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Typography from "@mui/material/Typography";
import LayersIcon from "@mui/icons-material/Layers";
import CheckIcon from "@mui/icons-material/Check";
import {
  useActiveMapBackground,
  useMapFiltersActions,
  useMaptilerMapId,
} from "@/app/lib/stores/mapFilters";
import { MapBackground } from "../lib/types/mapFilters";

export const Legend = () => {
  const [isOpenMapBackgrounds, setIsOpenMapBackgrounds] = useState(false);
  const [isCollapsedLegend, setIsCollapsedLegend] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { setActiveMapBackground } = useMapFiltersActions();
  const activeMapBackground = useActiveMapBackground();
  const maptilerMapId = useMaptilerMapId();

  const toggleMapBackgrounds = () => {
    setIsOpenMapBackgrounds(!isOpenMapBackgrounds);
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

  const styleLegend: CSSProperties = {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    maxHeight: isCollapsedLegend ? "60px" : "100%", // Increased height when not collapsed
    maxWidth: "300px",

    transition: "max-height 0.3s ease",
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
    <>
      {[
        { id: "ign-layer", label: "IGN Scan 25" },
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
    </>
  );

  const legendContent = (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "300px" }}>
          <MapIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography
            variant="inherit"
            fontSize={"15px"}
            textTransform={"uppercase"}
          >
            {`Légende et couches`}
          </Typography>
        </Box>

        <IconButton
          onClick={() => setIsCollapsedLegend(!isCollapsedLegend)}
          size="small"
        >
          {isCollapsedLegend ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {!isCollapsedLegend && (
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
                  borderColor: "#ff0000",
                  backgroundColor: "transparent",
                  marginRight: 10,
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
                <strong>Aires protégées</strong>
              </span>
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
                      fill="#009366"
                      stroke="#009366"
                      strokeWidth="1"
                      fillOpacity={0.4}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Autres Arrêtés Préfectoraux de Protection de Biotopes
                  </span>
                </Box>
              </Box>
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
                    fill="#98FB98"
                    stroke="#98FB98"
                    strokeWidth="1"
                    fillOpacity={0.6}
                  />
                </svg>
                <span style={{ marginLeft: 10 }}>
                  Espaces Naturels Sensibles
                </span>
              </Box>
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
                    fill="#000000"
                    stroke="#000000"
                    strokeWidth="1"
                    fillOpacity={0.2}
                  />
                </svg>
                <span style={{ marginLeft: 10 }}>
                  Réserves Naturelles Régionales
                </span>
              </Box>
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
                    fill="#ff8400"
                    stroke="#ff8400"
                    strokeOpacity={1}
                    strokeWidth="1"
                    opacity={0.15}
                  />
                </svg>
                <span style={{ marginLeft: 10 }}>
                  District franc fédéral Le Noirmont
                </span>
              </Box>
            </Box>
          </Box>

          <Box>
            <span>
              <strong>Haute Chaîne du Jura</strong>
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
              <svg width="21" height="21">
                <rect
                  width="21"
                  height="21"
                  fill="#4b0092"
                  stroke="#4b0092"
                  strokeWidth="1"
                  fillOpacity={0.15}
                />
              </svg>
              <span style={{ marginLeft: 10 }}>
                Réserve Naturelle Nationale
              </span>
            </Box>
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
                  fill="#4b0092"
                  stroke="#4b0092"
                  fillOpacity={0.4}
                  strokeWidth="1"
                />
              </svg>
              <span style={{ marginLeft: 10 }}>
                Zones de Quiétude de la Faune Sauvage
              </span>
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
            <Box sx={{ maxWidth: 380, mt: 1, fontSize: "13px" }}>
              {`D'autres zones réglementées sont également présentes sur le massif
          jurassien. Pour plus d'informations, consulter la réglementation
          locale.`}
            </Box>
          </Box>
        </>
      )}
    </>
  );

  return (
    <>
      <Box style={styleLegend}>{legendContent}</Box>
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
        style={{
          ...modalStyleMapBackgrounds,
          backgroundColor: "white",
          padding: 5,
        }}
      >
        <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
          <LayersIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography component="span" variant="button" fontSize={"15px"}>
            Fonds de carte
          </Typography>
        </Box>
        {mapBackgrounds}
      </Box>
    </>
  );
};
