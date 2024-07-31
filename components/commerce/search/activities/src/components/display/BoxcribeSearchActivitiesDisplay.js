import React, { useState } from "react";
import { cilGrid } from "../../assets/js/cilGrid";
import { cilListRich } from "../../assets/js/cilListRich";

export const DISPLAY_OPTIONS = {
  GRID: "grid",
  LIST: "list",
};

export default function BoxcribeSearchActivitiesDisplay({
  initialState = DISPLAY_OPTIONS.GRID,
  onChange,
}) {
  const [state, setState] = useState(initialState);

  function handleChange(value) {
    if (value === state) return;

    setState(value);
    onChange(value);
  }

  return (
    <div className="boxcribe-search-activities__display">
      <label>Display</label>
      <div className="boxcribe-search-activities__display-options">
        <div className="boxcribe-search-activities__btn-group">
          <button
            className={`boxcribe-search-activities__btn ${state === DISPLAY_OPTIONS.GRID ? "boxcribe-search-activities__btn-dark" : "boxcribe-search-activities__btn-white"}`}
            onClick={() => handleChange(DISPLAY_OPTIONS.GRID)}
          >
            {cilGrid} Grid
          </button>
          <button
            className={`boxcribe-search-activities__btn ${state === DISPLAY_OPTIONS.LIST ? "boxcribe-search-activities__btn-dark" : "boxcribe-search-activities__btn-white"}`}
            onClick={() => handleChange(DISPLAY_OPTIONS.LIST)}
          >
            {cilListRich} List
          </button>
        </div>
      </div>
    </div>
  );
}
