import React, { useEffect, useRef, useState } from "react";
import { setAnyState } from "../../state/state";
import { cilChevronBottomAlt } from "../../assets/js/cilChevronBottomAlt";

export default function BoxcribeSearchActivitiesMultiSelect({
  options = [],
  onChange = () => {},
}) {
  const ref = useRef();
  const [state, setState] = useState({
    show: false,
    options: [],
    selectedOptionLabel: "Select...",
  });

  useEffect(() => {
    function listener(event) {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handleClose();
    }

    document.addEventListener("mouseup", listener);
    document.addEventListener("touchend", listener);
    return () => {
      document.removeEventListener("mouseup", listener);
      document.removeEventListener("touchend", listener);
    };
  }, []);

  useEffect(() => {
    const selectedOption = options.find(({ selected }) => !!selected);
    setAnyState(setState, {
      options,
      selectedOptionLabel: selectedOption?.label ?? "Select...",
    });
  }, [options]);

  function handleSelectOption(option) {
    setAnyState(setState, {
      show: false,
      options: state.options.map(({ label, value }) => ({
        label,
        value,
        selected: value === option.value,
      })),
      selectedOptionLabel: option.label,
    });

    onChange(option.value);
  }

  function handleToggle() {
    setAnyState(setState, {
      show: !state.show,
    });
  }

  function handleClose() {
    setAnyState(setState, {
      show: false,
    });
  }

  return (
    <div
      ref={ref}
      className={`boxcribe-search-activities__multiselect ${state.show ? "active" : ""}`}
      onClick={handleToggle}
    >
      <div className="boxcribe-search-activities__multiselect-placeholder">
        <div>{state.selectedOptionLabel}</div>
        {cilChevronBottomAlt}
      </div>
      <div
        className={`boxcribe-search-activities__multiselect-options ${state.show ? "active" : ""}`}
      >
        {state.options.map((option, index) => (
          <div
            key={index}
            className={`boxcribe-search-activities__multiselect-options-item ${option.selected ? "active" : ""}`}
            onClick={() => handleSelectOption(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
