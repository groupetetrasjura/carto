"use client";
import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMapDownloadActions } from "@/app/lib/stores/mapDownload";

const ZoneCardPopup = ({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onDownload: () => void;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { setIsDownloadPopupOpen, setSelectedZoneName } =
    useMapDownloadActions();

  const handleDownloadClick = () => {
    let zoneValue = "";
    switch (title) {
      case "Massacre":
        zoneValue = "MASSACRE";
        break;
      case "Bois de Bans-Arobiers":
        zoneValue = "BOIS-DE-BANS";
        break;
      case "Risoux":
        zoneValue = "RISOUX";
        break;
      case "Haute Joux":
        zoneValue = "HAUTE-JOUX";
        break;
      case "Combe Noire":
        zoneValue = "COMBE-NOIRE";
        break;
      default:
        zoneValue = title;
    }
    setSelectedZoneName(zoneValue);
    setIsDownloadPopupOpen(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          ...styles.dialogContainer,
          width: isMobile ? "300px" : "380px",
          boxShadow: "none",
          left: isMobile ? "40%" : "50%",
        },
      }}
    >
      <Card>
        <CardMedia
          component="img"
          height="135"
          image={"/mountain.jpg"}
          alt={title}
        />
        <CardContent>
          <Typography variant="h6" component="div" textAlign="center">
            {title}
          </Typography>
        </CardContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "& .MuiButton-root": {
              flex: 1,
              margin: "0 8px",
            },
          }}
        >
          <Button variant="brownMain" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="outlined" onClick={handleDownloadClick}>
            Télécharger la réglementation
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
};

export default ZoneCardPopup;

const styles = {
  dialogContainer: {
    position: "fixed" as const,
    top: "5px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    zIndex: 1000,
  },
};
