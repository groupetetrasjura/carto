"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const InfoPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle fontSize={20}>Bienvenue sur la plateforme</DialogTitle>
      <DialogContent>
        <Typography gutterBottom sx={{ mb: 2 }} fontSize={14} component="p">
          5 massifs sont réglementés par l'Arrêté Préfectoral de Protection de
          Biotope (APPB) "Forêts d'altitude du Haut-Jura", visant à protéger
          leur biodiversité. Cet APPB restreint l'accès aux massifs en
          différentes périodes, plus ou moins sensibles pour les espèces qui y
          habitent. Merci de vous référer aux périodes pour connaître les
          itinéraires autorisés.
        </Typography>
        <Typography gutterBottom fontSize={14} component="p">
          Retrouvez la réglementation dans le bouton “...”.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="greenMain">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { InfoPopup };
