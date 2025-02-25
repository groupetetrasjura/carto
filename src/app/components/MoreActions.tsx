import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DownloadIcon from "@mui/icons-material/Download";
import ScreenshotIcon from "@mui/icons-material/ScreenLockPortrait";
import { useMediaQuery, useTheme } from "@mui/material";
import { useMapDownloadActions } from "@/lib/stores/mapDownload";
import { MapRef } from "react-map-gl";

export default function MoreActions({
  mapRef,
}: {
  mapRef: React.RefObject<MapRef> | null;
}) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { setIsDownloadPopupOpen } = useMapDownloadActions();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMapSnapshot = (mapRef: React.RefObject<MapRef>) => {
    mapRef.current?.getMap().triggerRepaint();
    mapRef.current?.getMap().once("render", async () => {
      const canvas = mapRef.current?.getMap().getCanvas();
      if (!canvas) return;

      // check webp support
      const isWebPSupported = () => {
        const elem = document.createElement("canvas");
        if (!!(elem.getContext && elem.getContext("2d"))) {
          return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
        }
        return false;
      };

      let imageDataUrl;
      let fileExtension;
      // use webp if supported
      if (isWebPSupported()) {
        imageDataUrl = await new Promise((resolve) => {
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob as Blob);
            },
            "image/webp",
            0.9
          );
        });
        fileExtension = "webp";
      } else {
        // use jpeg format
        imageDataUrl = canvas.toDataURL("image/jpeg", 0.9); // Qualité JPEG à 90%
        fileExtension = "jpg";
      }
      const link = document.createElement("a");
      link.href = imageDataUrl as string;
      link.download = `map_snapshot.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Snapshot downloaded as ${fileExtension}`);
    });
  };

  const actions = [
    {
      icon: <DownloadIcon />,
      name: "Télécharger la réglementation",
      onClick: () => setIsDownloadPopupOpen(true),
    },
    {
      icon: <ScreenshotIcon />,
      name: "Capture d'écran",
      onClick: () => handleMapSnapshot(mapRef as React.RefObject<MapRef>),
    },
  ];

  const speedDialTabletStyle = {
    position: "absolute",
    bottom: 60,
    left: 12,
  };

  const speedDialDesktopStyle = {
    position: "absolute",
    bottom: 12,
    left: 12,
  };

  return (
    <Box
      sx={{
        height: "100%",
        transform: "translateZ(0px)",
        flexGrow: 1,
        pointerEvents: "none",
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip"
        sx={isTablet ? speedDialTabletStyle : speedDialDesktopStyle}
        icon={<MoreVertIcon sx={{ color: "#A2BE73" }} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{ color: "default" }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen={false}
            onClick={action.onClick}
            tooltipPlacement="right"
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
