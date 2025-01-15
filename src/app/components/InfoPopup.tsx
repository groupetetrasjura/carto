"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";

const InfoPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [open] = useState(true);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1, mt: 4 }}>
        <Image
          src="/logo.png"
          alt="Groupe Tétra Jura"
          width={200}
          height={200}
        />
      </Box>
      <DialogTitle fontSize={20}>Bienvenue sur la plateforme</DialogTitle>
      <DialogContent>
        <Typography gutterBottom sx={{ mb: 2 }} fontSize={14} component="p">
          {`5 massifs sont réglementés par l'Arrêté Préfectoral de Protection de Biotope (APPB) "Forêts d'altitude du Haut-Jura", visant à protéger leur biodiversité. Cet APPB restreint l'accès aux massifs en différentes périodes, plus ou moins sensibles pour les espèces qui y habitent.`}
        </Typography>
        <Typography gutterBottom fontSize={14} component="p">
          {`Cette plateforme interactive vous permettra de connaître simplement les itinéraires autorisés de chaque massif en fonction de la date de votre venue et de votre mode de déplacement. Vous pourrez aussi vous géolocaliser une fois sur place pour plus de précision. Attention, le réseau Internet mobile dans les forêts jurassiennes est limité. Nous vous conseillons donc de télécharger certaines cartes sur votre téléphone au cas où l'accès à cette plateforme ne soit pas possible. Elles sont accessibles via le bouton "...", puis "Télécharger la réglementation".`}
        </Typography>
        <Typography sx={{ mt: 3 }} fontSize={14} component="p">
          {`Bonne visite !`}
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
