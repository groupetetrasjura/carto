import { Box, Typography, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export const FOOTER_HEIGHT = 35; // en pixels

const Footer = ({ onHide }: { onHide: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onHide(); // Notifie le parent que le footer est masqué
  };

  if (!isVisible) return null;

  return (
    <Box
      component="footer"
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: `${FOOTER_HEIGHT}px`,
        backgroundColor: "#fff",
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
        padding: "0 10px",
      }}
    >
      <Typography variant="body2" component="span" sx={{ fontSize: "0.75rem" }}>
        Développé par
      </Typography>
      <Link
        href="https://www.natural-solutions.eu/"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/NS_LOGO.svg"
          alt="Natural Solutions"
          sx={{
            height: 45,
            width: "auto",
          }}
        />
      </Link>
      <IconButton
        onClick={handleClose}
        sx={{
          padding: 0,
          color: "text.secondary",
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default Footer;
