import React from "react";
import { past } from "../../state/ccp";
import { useShapes } from "../../state/state";

const Ccp = () => {
  // const swimlaneId = useShapes((state) => state.selectedSwimlane);

  return (
    <aside className="panel">
      <h2>Actions</h2>
      <div className="side-buttons">
        <button onClick={() => past()}>Past</button>
      </div>
    </aside>
  );
};

export default Ccp;
