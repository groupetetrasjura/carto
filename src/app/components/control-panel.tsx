import * as React from 'react';

import ZONES from '@/lib/data/zones.json';


// TODO: add types
function ControlPanel(props) {
  return (
    <div className="control-panel">
      <h3>APPB Transition</h3>
      <p>Mouvement vers les APPB</p>
      <hr />

      {ZONES.map((zone, index) => (
        <div key={`btn-${index}`} className="input">
          <input
            type="radio"
            name="city"
            id={`city-${index}`}
            defaultChecked={zone.zone === 'Massacre'}
            onClick={() => props.onSelectZone(zone)}
          />
          <label htmlFor={`city-${index}`}>{zone.zone}</label>
        </div>
      ))}
    </div>
  );
}

export default React.memo(ControlPanel);