import React, { useEffect, useRef, useState } from "react";
import { cilSortAscending } from "../../assets/js/cilSortAscending";
import { cilSortDescending } from "../../assets/js/cilSortDescending";
import { cilChevronBottomAlt } from "../../assets/js/cilChevronBottomAlt";

const sortByOptions = [
  {
    label: "Price",
    value: {
      sort_by: "price",
      sort_order: "asc",
    },
  },
  {
    label: "Distance",
    value: {
      sort_by: "distance",
      sort_order: "asc",
    },
  },
  {
    label: "Guest Score",
    value: {
      sort_by: "rating",
      sort_order: "desc",
    },
  },
];

export default function BoxcribeSearchActivitiesSortBy({ onChange }) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState(sortByOptions[2]);

  useEffect(() => {
    function listener(event) {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      setShow(false);
    }

    document.addEventListener("mouseup", listener);
    document.addEventListener("touchend", listener);
    return () => {
      document.removeEventListener("mouseup", listener);
      document.removeEventListener("touchend", listener);
    };
  }, []);

  function handleSelectOption(option) {
    setSelectedOption(option);
    setShow(false);
    onChange(option.value);
  }

  return (
    <div className="boxcribe-search-activities__sort-by">
      <label>Sort By</label>
      <div
        ref={ref}
        className={`boxcribe-search-activities__multiselect ${show ? "active" : ""}`}
        onClick={() => setShow(!show)}
      >
        <div className="boxcribe-search-activities__multiselect-placeholder">
          {selectedOption.value.sort_order === "asc"
            ? cilSortAscending
            : cilSortDescending}
          {selectedOption.label}
          {cilChevronBottomAlt}
        </div>
        <div
          className={`boxcribe-search-activities__multiselect-options ${show ? "active" : ""}`}
        >
          {sortByOptions.map((option) => (
            <div
              key={option.value.sort_by}
              className={`boxcribe-search-activities__multiselect-options-item ${option.value.sort_by === selectedOption.value.sort_by ? "active" : ""}`}
              onClick={() => handleSelectOption(option)}
            >
              {option.value.sort_order === "asc"
                ? cilSortAscending
                : cilSortDescending}
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
