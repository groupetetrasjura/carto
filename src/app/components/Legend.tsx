import Image from "next/image";
import {
  Box,
  IconButton,
} from "@mui/material"; // Removed `useMediaQuery` and `useTheme`
import { CSSProperties, useState, useEffect, useRef } from "react";
import MapIcon from "@mui/icons-material/Map";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Typography from "@mui/material/Typography";
import {
  useMapFiltersActions,
  useMapFiltersSelectedDate,
} from "@/app/lib/stores/mapFilters";
import {
  useLayersVisibility,
  useMapStoreActions,
} from "../lib/stores/mapStore";
import { isInRecommendedPeriod } from "../lib/utils";
import { Dayjs } from "dayjs";

const PATH_TYPES = {
  recommended: {
    source: "recommended-paths-source",
    shouldClear: (date: Dayjs | null) =>
      date !== null && !isInRecommendedPeriod(date),
    message: "les itinéraires recommandés sont accessibles du 01/07 au 14/12.",
  },
  authorized: {
    source: "authorized-paths-source",
    shouldClear: (date: Dayjs | null) =>
      date !== null && isInRecommendedPeriod(date),
    message: "les itinéraires autorisés sont uniquement valables du 15/12 au 30/06.",
  },
};

interface LegendProps {
  setSnackbarMessage: (message: string) => void;
  top: number; // Add a `top` prop to dynamically position the legend
}

export const Legend = ({ setSnackbarMessage, top }: LegendProps) => {
  const [isCollapsedLegend, setIsCollapsedLegend] = useState(true);
  const layersVisibility = useLayersVisibility();
  const selectedDate = useMapFiltersSelectedDate();
  const { setSelectedDate } = useMapFiltersActions();
  const { setLayerVisibility, toggleLayer } = useMapStoreActions();

  const legendRef = useRef<HTMLDivElement>(null);

  const handleTogglePaths = (type: "recommended" | "authorized") => {
    const config = PATH_TYPES[type];
    const shouldClearDate = config.shouldClear(selectedDate);

    if (shouldClearDate) {
      setSelectedDate(null);
      setSnackbarMessage(config.message); // Use setSnackbarMessage from props
    }

    setTimeout(() => {
      setLayerVisibility(config.source);
    }, 0);
  };

  const styleLegend: CSSProperties = {
    position: "absolute", // Ensure it is positioned relative to the parent
    top: `${top || 15}px`, // Fallback to 15px if `top` is undefined
    left: "50%", // Center horizontally
    transform: "translateX(-50%)", // Ensure proper centering
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    maxHeight: isCollapsedLegend
      ? "60px"
      : `calc(100vh - ${top + 100}px)`, // Dynamically calculate height to avoid overlapping
    maxWidth: "320px", // Ensure the legend has a proper width
    overflow: isCollapsedLegend ? "hidden" : "auto",
    zIndex: 1000, // Ensure it is above other elements
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
        <Box sx={{ display: "flex", alignItems: "center", width: "300px" }}>
          <MapIcon style={{ marginRight: "5px", color: "#725E51" }} />
          <Typography
            variant="inherit"
            fontSize={"15px"}
            textTransform={"uppercase"}
            color="#434A4A"
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
          <Box sx={{ color: "#000" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <strong>Itinéraires autorisés selon les périodes de l&apos;année :</strong>
              </span>

              <IconButton onClick={() => handleTogglePaths("authorized")}>
                {layersVisibility["authorized-paths-source"] ? (
                  <VisibilityIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                )}
              </IconButton>
            </Box>
            {layersVisibility["authorized-paths-source"] && (
              <>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2px",
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
                  <span>{`Du 01/07 au 14/05`}</span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2px",
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
                  <span>{`Toute l'année`}</span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2px",
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
                  <span>{`Du 15/05 au 14/12`}</span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2px",
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
                  <span>{`Du 01/07 au 1er dimanche de mars`}</span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "2px",
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

                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
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
              </>
            )}


            <Box>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    marginTop: "10px", // Add marginTop to create spacing above
                    display: "block", // Ensure the margin applies properly
                  }}
                >
                  <strong>Itinéraires recommandés du 01/07 au 14/12 :</strong>
                </span>
                <IconButton onClick={() => handleTogglePaths("recommended")}>
                  {layersVisibility["recommended-paths-source"] ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>

              {layersVisibility["recommended-paths-source"] && (
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      width: 20,
                      height: 3,
                      borderStyle: "dashed",
                      borderWidth: 2,
                      borderColor: "#000",
                      backgroundColor: "transparent",
                      marginRight: 10,
                    }}
                  ></Box>
                  <span>{`Du 01/07 au 14/12`}</span>
                </Box>
              )}
            </Box>


            <Box>
              <span
                style={{
                  marginTop: "20px", // Add marginTop to create spacing above
                  display: "block", // Ensure the margin applies properly
                }}
              >
                <strong>Aires protégées :</strong>
              </span>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#009366"
                      stroke="gray"
                      strokeWidth={3}
                      fillOpacity={0.23}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    {`Arrêté Préfectoral de Protection de Biotope "Forêts d'altitude du Haut-Jura"`}
                  </span>
                </div>
              </Box>

              <Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg width="24" height="24" style={{ flexShrink: 0 }}>
                      <rect
                        width="24"
                        height="24"
                        fill="#009366"
                        stroke="#009366"
                        strokeWidth={3}
                        fillOpacity={0.4}
                      />
                    </svg>
                    <span style={{ marginLeft: 10 }}>
                      Autres Arrêtés Préfectoraux de Protection de Biotope
                    </span>
                  </div>
                  <IconButton onClick={() => toggleLayer("other-appb-source")}>
                    {layersVisibility["other-appb-source"] ? (
                      <VisibilityIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#98FB98"
                      stroke="#98FB98"
                      strokeWidth={3}
                      fillOpacity={0.6}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Espaces Naturels Sensibles
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("protected-areas-source", "ENS")}
                >
                  {layersVisibility["protected-areas-source"].ENS ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#000000"
                      stroke="#000000"
                      strokeWidth={3}
                      fillOpacity={0.2}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Réserves Naturelles Régionales
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("protected-areas-source", "RNR")}
                >
                  {layersVisibility["protected-areas-source"].RNR ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#ff8400"
                      stroke="#ff8400"
                      strokeOpacity={1}
                      strokeWidth={3}
                      fillOpacity={0.15}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    District franc fédéral Le Noirmont
                  </span>
                </div>
                <IconButton
                  onClick={() => toggleLayer("swiss-protected-areas-source")}
                >
                  {layersVisibility["swiss-protected-areas-source"] ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "3px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" style={{ flexShrink: 0 }}>
                    <rect
                      width="24"
                      height="24"
                      fill="#4b0092"
                      stroke="#4b0092"
                      strokeWidth={3}
                      fillOpacity={0.15}
                    />
                  </svg>
                  <span style={{ marginLeft: 10 }}>
                    Réserve Naturelle Nationale de la Haute-Chaîne du Jura
                  </span>
                </div>
                <Box style={{ alignSelf: "flex-end" }}>
                  <IconButton
                    onClick={() => toggleLayer("protected-areas-source", "RNN")}
                  >
                    {layersVisibility["protected-areas-source"].RNN ? (
                      <VisibilityIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "3px",
                }}
              >
                <svg width="24" height="24" style={{ flexShrink: 0 }}>
                  <rect
                    width="24"
                    height="24"
                    fill="#4b0092"
                    stroke="#4b0092"
                    fillOpacity={0.4}
                    strokeWidth={3}
                  />
                </svg>
                <span style={{ marginLeft: 10 }}>
                  Zones de Quiétude de la Faune Sauvage
                </span>

                <IconButton onClick={() => toggleLayer("zonages-zqfs-source")}>
                  {layersVisibility["zonages-zqfs-source"] ? (
                    <VisibilityIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <VisibilityOffIcon className="w-5 h-5 text-red-500" />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ color: "#000" }}>
            <Box>
            <span
                style={{
                  marginTop: "10px", // Add marginTop to create spacing above
                  display: "block", // Ensure the margin applies properly
                }}
              >
                <strong>Autres informations :</strong>
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
                <span>Parkings à proximité</span>
              </Box>
            </Box>

            <Box sx={{ maxWidth: 380, mt: 1, fontSize: "13px", marginTop: "20px" }}>
              {`D'autres zones réglementées sont également présentes sur le massif
          jurassien. Pour plus d'informations, consulter la réglementation
          locale.`}
            </Box>
          </Box>
        </>
      )}
    </>
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      legendRef.current &&
      !legendRef.current.contains(event.target as Node)
    ) {
      setIsCollapsedLegend(true);
    }
  };
  // close element Legend if click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={legendRef} style={styleLegend}>
      {legendContent}
    </Box>
  );
};
