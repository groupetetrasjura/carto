import { Box, Typography, Link } from "@mui/material";

export const FOOTER_HEIGHT = 35; // en pixels

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        height: `${FOOTER_HEIGHT}px`,
        backgroundColor: "#fff",
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
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
          src="/NS_LOGO.svg" // ← chemin vers ton fichier image
          alt="Natural Solutions"
          sx={{
            height: 45,
            width: "auto",
          }}
        />
      </Link>
    </Box>
  );
};

export default Footer;
