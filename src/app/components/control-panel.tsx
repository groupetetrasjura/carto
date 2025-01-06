import * as React from "react";

// import ZONES from "@/lib/data/zones.json";
// import { ControlPanelProps } from "@/app/lib/types/Components";
// import { Zone } from "@/app/lib/types/Components";

import MaplibreStyledButton from "@/app/components/MaplibreStyledButton";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import DownloadIcon from "@mui/icons-material/Download";
import ScreenshotIcon from "@mui/icons-material/Screenshot";
import { useMapFiltersActions } from "../lib/stores/mapFilters";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { useMapDownloadActions } from "@/lib/stores/mapDownload";

// TODO: add types
function ControlPanel({
  handleMapSnapshot,
}: {
  handleMapSnapshot: () => void;
}) {
  const { clearMapFilters } = useMapFiltersActions();
  const { setIsDownloadPopupOpen } = useMapDownloadActions();
  return (
    <div className="custom-control-container">
      <Stack direction="column" spacing={1}>
        <Tooltip title="Supprimer les filtres" placement="left">
          <MaplibreStyledButton size="small" onClick={() => clearMapFilters()}>
            <DoNotDisturbAltIcon fontSize="small" />
          </MaplibreStyledButton>
        </Tooltip>
        <Tooltip title="Télécharger les données" placement="left">
          <MaplibreStyledButton
            size="small"
            onClick={() => setIsDownloadPopupOpen(true)}
          >
            <DownloadIcon fontSize="small" />
          </MaplibreStyledButton>
        </Tooltip>
        <Tooltip title="Capture de la carte" placement="left">
          <MaplibreStyledButton size="small" onClick={handleMapSnapshot}>
            <ScreenshotIcon fontSize="small" />
          </MaplibreStyledButton>
        </Tooltip>
      </Stack>
      {/* <h3>APPB Transition</h3>
        <p>Mouvement vers les APPB</p>
        <hr />

        {ZONES.map((zone: Zone, index: number) => (
          <div key={`btn-${index}`} className="input">
            <input
              type="radio"
              name="city"
              id={`city-${index}`}
              defaultChecked={zone.zone === "Massacre"}
              onClick={() => props.onSelectZone(zone)}
            />
            <label htmlFor={`city-${index}`}>{zone.zone}</label>
          </div>
        ))} */}
    </div>
  );
}

export default React.memo(ControlPanel);
