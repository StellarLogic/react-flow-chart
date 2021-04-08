import React from "react";
import { reset, saveDiagram, useShapes } from "../state/state";

const Json = ({ handleJson }) => {
  const state = useShapes((state) => state.swimlanes);
  console.log(`json`, state.swimlanes);
  return (
    <div className="json">
      <div className="buttons">
        <button onClick={handleJson}>Json</button>
        <button onClick={saveDiagram}>Save</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="json-print">
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Json;
