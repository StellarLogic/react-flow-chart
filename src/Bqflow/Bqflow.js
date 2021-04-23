import React, { useEffect, useState, useRef } from "react";
import { Palette } from "./Palette";
import Canvas from "./Canvas";
import {
  useShapes,
  addSwimLane,
  saveDiagram,
  reset,
  setState,
  openMenu,
  closeMenu,
} from "./state/state";
import "./style.css";
import "./responsive.css";
import Json from "./Json/Json";
import Menu from "./components/Menu/Menu";
import PropTypes from "prop-types";

function Bqflow({ palette = [], data = {} }, ref) {
  const { selectedSwimlane, swimlanes, ccp } = useShapes((state) => state);
  const [isJsonActive, setisJsonActive] = useState(false);
  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const propertyRef = useRef(null);
  const state = useShapes((state) => state);
  console.log(`state`, state);
  // state.swimlanes[Object.keys(state.swimlanes)[0]].lastId,
  // state.swimlanes[Object.keys(state.swimlanes)[0]].lines

  useEffect(() => {
    if (typeof data == "object" && Object.keys(data).length)
      setState((state) => {
        state.swimlanes = data;
      });
  }, []);

  const handleScreen = () => {
    setisJsonActive(!isJsonActive);
  };

  const sortedSwimlane = Object.entries(swimlanes).sort(
    ([keyA, a], [keyB, b]) => {
      return a.place - b.place;
    }
  );

  const handleRef = (ref) => {
    setSelectedCanvas(ref);
  };

  return (
    <>
      {isJsonActive ? (
        <Json handleJson={handleScreen} />
      ) : (
        <div
          className="bqflow"
          onContextMenu={(e) => openMenu(e, propertyRef)}
          onClick={closeMenu}
        >
          <Menu clickedCan={selectedCanvas} />
          <Palette />
          <div className="property-wrapper" ref={propertyRef}>
            <div className="swimlanes">
              {sortedSwimlane &&
                sortedSwimlane.map(([key, swimlane], index) => {
                  return (
                    <Canvas
                      key={key}
                      id={key}
                      swimlane={swimlane}
                      index={index + 1}
                      childRef={handleRef}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
Bqflow.propTypes = {
  palette: PropTypes.array.isRequired,
  data: PropTypes.object,
};

export default Bqflow;
