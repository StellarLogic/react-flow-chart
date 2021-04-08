import React, { useState } from "react";
import { Palette } from "./Palette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./components/sidebar/PropertiesPanel";
import { useShapes, addSwimLane, saveDiagram, reset } from "./state/state";
import "./style.css";
import "./responsive.css";
import Json from "./Json/Json";
import Ccp from "./components/sidebar/Ccp";

function Bqflow({ palette = [] }) {
  const { selectedSwimlane, swimlanes, ccp } = useShapes((state) => state);
  const [isJsonActive, setisJsonActive] = useState(false);
  const state = useShapes((state) => state);
  console.log(`Object.entries(swimlanes)[0].lines`, state);

  const handleScreen = () => {
    setisJsonActive(!isJsonActive);
  };

  return (
    <>
      {isJsonActive ? (
        <Json handleJson={handleScreen} />
      ) : (
        <div className="bqflow">
          <Palette />
          <div className="property-wrapper">
            <div className="swimlanes">
              <button className="add-swim-btn" onClick={addSwimLane}>
                Add
              </button>
              {swimlanes ? (
                <div className="buttons">
                  <button onClick={handleScreen}>Json</button>
                  <button onClick={saveDiagram}>Save</button>
                  <button onClick={reset}>Reset</button>
                </div>
              ) : null}
              {Object.entries(swimlanes) &&
                Object.entries(swimlanes).map(([key, swimlane], index) => {
                  return (
                    <Canvas
                      key={key}
                      id={key}
                      swimlane={swimlane}
                      index={index + 1}
                    />
                  );
                })}
            </div>
            {selectedSwimlane ? !ccp ? <PropertiesPanel /> : <Ccp /> : null}
          </div>
        </div>
      )}
    </>
  );
}

export default Bqflow;
