import { Snackbar as MuiSnackbar, Alert } from "@mui/material";
import { FOOTER_HEIGHT } from "./Footer";

interface SnackbarProps {
  message: string;
  onClose: () => void;
}

const Snackbar = ({ message, onClose }: SnackbarProps) => {
  return (
    <MuiSnackbar
      open={!!message}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ bottom: `${FOOTER_HEIGHT + 8}px` }}
    >
      <Alert onClose={onClose} severity="info" sx={{ width: "100%" }}>
        Le filtre de date a été désactivé{" "}
        {message ? `: ${message}` : ""}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
