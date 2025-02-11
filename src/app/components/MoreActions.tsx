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

export default function MoreActions({
  handleMapSnapshot,
}: {
  handleMapSnapshot: () => void;
}) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { setIsDownloadPopupOpen } = useMapDownloadActions();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    {
      icon: <DownloadIcon />,
      name: "Télécharger la réglementation",
      onClick: () => setIsDownloadPopupOpen(true),
    },
    {
      icon: <ScreenshotIcon />,
      name: "Capture d'écran",
      onClick: handleMapSnapshot,
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
        height: "100vh",
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
