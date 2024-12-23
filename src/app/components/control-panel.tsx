import * as React from "react";

// import ZONES from "@/lib/data/zones.json";
// import { ControlPanelProps } from "@/app/lib/types/Components";
// import { Zone } from "@/app/lib/types/Components";

import MaplibreStyledButton from "@/app/components/MaplibreStyledButton";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { useMapFiltersActions } from "../lib/stores/mapFilters";
import Tooltip from "@mui/material/Tooltip";

// TODO: add types
function ControlPanel() {
  const { clearMapFilters } = useMapFiltersActions();
  return (
    <div className="custom-control-container">
      <Tooltip title="Supprimer les filtres" placement="left">
        <MaplibreStyledButton size="small" onClick={() => clearMapFilters()}>
          <DoNotDisturbAltIcon fontSize="small" />
        </MaplibreStyledButton>
      </Tooltip>
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
