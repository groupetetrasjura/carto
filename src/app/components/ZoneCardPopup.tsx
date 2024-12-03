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

const ZoneCardPopup = ({
  open,
  onClose,
  title,
  onDownload,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  onDownload: () => void;
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
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
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button variant="brownMain" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="outlined" onClick={onDownload}>
            Télécharger le PDF
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
