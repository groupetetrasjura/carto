"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  styled,
  Typography,
  useTheme,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DownhillSkiingIcon from "@mui/icons-material/DownhillSkiing";
import { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import {
  useMapFiltersActions,
  useMapFiltersCurrentStep,
  useMapFiltersSelectedDate,
  useMapFiltersSelectedTransport,
  useMapFiltersSelectedZones,
} from "@/app/lib/stores/mapFilters";
import { TransportType, Zone } from "@/app/lib/types/mapFilters";
import { DateCalendar } from "@mui/x-date-pickers";

const CustomBulletStepper = styled(Stepper)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "15px",
  gap: "16px",
  "& .MuiStepConnector-root": {
    display: "none",
  },
  "& .MuiStepLabel-root": {
    padding: 0,
    margin: 0,
  },
  "& .MuiStepLabel-iconContainer": {
    padding: 0,
    margin: 0,
  },
  "& .MuiStepIcon-root": {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[300],
    "& .MuiStepIcon-text": {
      display: "none",
    },
  },
  "& .MuiStepIcon-root.Mui-active": {
    backgroundColor: theme.palette.brown.main,
    color: theme.palette.brown.main,
  },
  "& .MuiStepIcon-root.Mui-completed": {
    backgroundColor: theme.palette.grey[300], // Change this to the desired color for completed steps
    color: theme.palette.grey[300],
  },
}));

const MultiStepFormPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    setSelectedZones,
    setSelectedTransport,
    setSelectedDate,
    setCurrentStep,
  } = useMapFiltersActions();
  const selectedZones = useMapFiltersSelectedZones();
  const selectedTransport = useMapFiltersSelectedTransport();
  const selectedDate = useMapFiltersSelectedDate();
  const currentStep = useMapFiltersCurrentStep();
  const theme = useTheme();

  const [open] = useState<boolean>(true);

  const handleClose = (): void => {
    setCurrentStep(1);
    onClose();
  };

  const handleNext = (): void => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (): void => {
    console.log("Form submitted:", {
      selectedZones,
      selectedTransport,
      selectedDate,
    });
    handleClose();
  };

  const steps: string[] = [
    "Choix du massif",
    "Mode de transport",
    "Date de visite",
  ];

  const zones: { name: Zone; city: string }[] = [
    { name: "Massacre", city: "Lajoux, Les Rousses" },
    { name: "Bois de Bans-Arobiers", city: "Longchaumois, Les Rousses" },
    { name: "Risoux", city: "Les Rousses, Bois-d'Amont, Bellefontaine" },
    { name: "Haute Joux", city: "Mignovillard, Pontarlier, Champagnole" },
    { name: "Combe Noire", city: "Mignovillard, Pontarlier, Champagnole" },
  ];

  const getStepContent = (step: number): React.ReactNode => {
    switch (step) {
      case 0:
        return (
          <List>
            <Typography
              gutterBottom
              fontSize="16px"
              color="brownMain"
              fontWeight={600}
              textAlign={"center"}
            >
              Quels massifs souhaitez-vous visiter ?
            </Typography>
            {zones.map((zone) => (
              <ListItem key={zone.name} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedZones(zone.name)}
                  selected={selectedZones.some((z) => z === zone.name)}
                >
                  <ListItemIcon>
                    <LandscapeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={zone.name}
                    secondary={`(~${zone.city})`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        );
      case 1:
        return (
          <>
            <Typography
              gutterBottom
              fontSize="16px"
              fontWeight={600}
              textAlign={"center"}
              color="brownMain"
            >
              Comment souhaitez-vous visiter le massif ?
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={3} mt={2}>
              <Paper
                elevation={3}
                sx={[
                  {
                    ...styles.paper,
                    opacity: selectedTransport === TransportType.CAR ? 1 : 0.5,
                  },
                ]}
                onClick={() => setSelectedTransport(TransportType.CAR)}
              >
                <DirectionsCarIcon
                  style={{ color: theme.palette.green.main, fontSize: "40px" }}
                />
                <Typography color="greenMain">En voiture</Typography>
              </Paper>
              <Paper
                elevation={3}
                sx={[
                  {
                    ...styles.paper,
                    opacity:
                      selectedTransport === TransportType.OUTDOOR ? 1 : 0.5,
                  },
                ]}
                onClick={() => setSelectedTransport(TransportType.OUTDOOR)}
              >
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <DirectionsWalkIcon
                    style={{
                      color: theme.palette.green.main,
                      fontSize: "40px",
                    }}
                  />
                  <DirectionsBikeIcon
                    style={{
                      color: theme.palette.green.main,
                      fontSize: "40px",
                    }}
                  />
                  <DownhillSkiingIcon
                    style={{
                      color: theme.palette.green.main,
                      fontSize: "40px",
                    }}
                  />
                </Box>
                <Typography color="greenMain">Autre</Typography>
              </Paper>
            </Stack>
          </>
        );
      case 2:
        return (
          <>
            <Typography
              color="brownMain"
              gutterBottom
              fontSize="16px"
              fontWeight={600}
              textAlign={"center"}
            >
              Quand souhaitez-vous visiter le massif ?
            </Typography>
            <Stack direction="row" justifyContent="center" mt={2}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fr"
              >
                <DateCalendar
                  value={selectedDate ? selectedDate : null}
                  onChange={(newValue: Dayjs | null) =>
                    setSelectedDate(newValue)
                  }
                />
              </LocalizationProvider>
            </Stack>
          </>
        );
      default:
        return "Étape inconnue";
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign={"center"}>
        Planifiez votre visite dès maintenant
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CustomBulletStepper activeStep={currentStep}>
          {steps.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
        </CustomBulletStepper>

        {getStepContent(currentStep)}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", width: "100%" }}>
        {currentStep === 0 ? (
          <>
            <Button variant="brownMain" onClick={handleClose}>
              Plus tard
            </Button>
            <Button variant="greenMain" onClick={handleNext}>
              Valider
            </Button>
          </>
        ) : (
          <>
            <Button variant="brownMain" onClick={handleBack}>
              Retour
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button variant="greenMain" onClick={handleSubmit}>
                Valider
              </Button>
            ) : (
              <Button variant="greenMain" onClick={handleNext}>
                Valider
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { MultiStepFormPopup };

const styles = {
  paper: {
    borderRadius: "8px",
    padding: "16px",
    cursor: "pointer",

    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    },
    width: "30%", //
  },
};
