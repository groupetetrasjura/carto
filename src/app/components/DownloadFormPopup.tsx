"use client";
import React from "react";
import {
  Dialog,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  useIsDownloadPopupOpen,
  useSelectedZoneName,
  useSelectedPeriod,
  useDateRange,
  useMapDownloadActions,
} from "@/app/lib/stores/mapDownload";

const DownloadFormPopup = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isOpen = useIsDownloadPopupOpen();
  const selectedZoneName = useSelectedZoneName();
  const selectedPeriod = useSelectedPeriod();
  const dateRange = useDateRange();
  const {
    setIsDownloadPopupOpen,
    setSelectedPeriod,
    setSelectedZoneName,
    clearDownloadState,
  } = useMapDownloadActions();

  const handleClose = () => {
    setIsDownloadPopupOpen(false);
    clearDownloadState();
  };

  const handleDownload = () => {
    if (selectedZoneName && selectedPeriod) {
      const fileName = `${selectedZoneName}_${selectedPeriod}.jpeg`;
      window.open(`/cartes/${fileName}`, "_blank");
    }
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            textAlign="left"
            gutterBottom
          >
            Téléchargement {selectedZoneName}
          </Typography>

          <Typography
            variant="subtitle1"
            component="div"
            textAlign="left"
            color="text.secondary"
            gutterBottom
          >
            Sélectionnez les massifs dont vous souhaitez télécharger la
            documentation, sur la période qui vous concerne :
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Zone</InputLabel>
            <Select
              value={selectedZoneName || ""}
              onChange={(e) => setSelectedZoneName(e.target.value)}
              label="Zone"
            >
              <MenuItem value="MASSACRE">Massacre</MenuItem>
              <MenuItem value="BOIS-DE-BANS">Bois de Bans-Arobiers</MenuItem>
              <MenuItem value="RISOUX">Risoux</MenuItem>
              <MenuItem value="HAUTE-JOUX">Haute Joux</MenuItem>
              <MenuItem value="COMBE-NOIRE">Combe Noire</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={selectedPeriod || ""}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              label="Période"
            >
              <MenuItem value="15_12-14_05">du 15/12 au 14/05</MenuItem>
              <MenuItem value="15_05-30_06">du 15/05 au 30/06</MenuItem>
              <MenuItem value="01_07-14_12">du 01/07 au 14/12</MenuItem>
            </Select>
          </FormControl>
        </CardContent>

        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
        >
          <Button variant="brownMain" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownload}
            disabled={
              !selectedPeriod ||
              (selectedPeriod === "custom" &&
                (!dateRange.startDate || !dateRange.endDate))
            }
          >
            Télécharger
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
};

export default DownloadFormPopup;

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
