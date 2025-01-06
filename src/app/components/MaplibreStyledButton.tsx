import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { grey } from "@mui/material/colors";

const MaplibreStyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  display: "inline-block",
  padding: "4px 4px 0px 4px",
  minHeight: 0,
  minWidth: 0,
  borderRadius: "15%",
  color: theme.palette.getContrastText(grey[500]),
  backgroundColor: grey[50],
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  border: "2px solid",
  lineHeight: 1.5,
  borderColor: grey[300],
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  "&:hover": {
    backgroundColor: grey[200],
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: grey[200],
    borderColor: grey[300],
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
}));

export default MaplibreStyledButton;
