import React, { useEffect, useState } from "react";
import { getTrackBackground, Range } from "react-range";
import { setAnyState } from "../../state/state";
import { cilDollar } from "../../assets/js/cilDollar";
import { cilWalk } from "../../assets/js/cilWalk";

const initialState = {
  filter_by_price_min: 0,
  filter_by_price_max: 10000,
  filter_by_distance_min: 0,
  filter_by_distance_max: 100,
  filter_by_rating_min: 0,
};
const PRICE_STEP = 10;
const PRICE_MIN = 0;
const PRICE_MAX = 10000;
const DISTANCE_STEP = 0.2;
const DISTANCE_MIN = 0;
const DISTANCE_MAX = 100;
const initialRatingOptions = getInitialRatingOptions();
function getInitialRatingOptions() {
  return [
    {
      label: "Excellent (9+)",
      value: 9,
      checked: false,
    },
    {
      label: "Very Good (7+)",
      value: 7,
      checked: false,
    },
    {
      label: "Good (5+)",
      value: 5,
      checked: false,
    },
    {
      label: "Average",
      value: 0,
      checked: false,
    },
  ];
}

export default function BoxcribeSearchActivitiesFilter({
  show,
  onChange,
  reset = null,
}) {
  const [filter, setFilter] = useState(initialState);
  const [ratingOptions, setRatingOptions] = useState(initialRatingOptions);
  const priceRange = [filter.filter_by_price_min, filter.filter_by_price_max];
  const distanceRange = [
    filter.filter_by_distance_min,
    filter.filter_by_distance_max,
  ];

  useEffect(() => {
    if (!reset || filter === initialState) return;

    setFilter(initialState);
    setRatingOptions(getInitialRatingOptions());
    onChange(initialState);
  }, [reset]);

  function handlePriceRangeChange([min, max]) {
    setAnyState(setFilter, {
      filter_by_price_min: min,
      filter_by_price_max: max,
    });
  }

  function handleSubmitPriceRangeChange() {
    onChange(filter);
  }

  function handleDistanceChange([min, max]) {
    setAnyState(setFilter, {
      filter_by_distance_min: min,
      filter_by_distance_max: max,
    });
  }

  function handleSubmitDistanceChange() {
    onChange(filter);
  }

  function handleRatingChange(event) {
    let ratingOptionsClone = [...ratingOptions];
    const foundRating = ratingOptionsClone.find(
      (item) => item.value === Number(event.target.value),
    );

    if (event.target.checked) {
      foundRating.checked = true;
    } else {
      foundRating.checked = false;
    }

    setRatingOptions(ratingOptionsClone);
    const allCheckedRatings = ratingOptionsClone
      .filter((item) => item.checked)
      .map(({ value }) => value);
    const partialUpdateState = {
      filter_by_rating_min: allCheckedRatings.length
        ? Math.min(...allCheckedRatings)
        : 0,
    };

    const newFilter = {
      ...filter,
      ...partialUpdateState,
    };

    setAnyState(setFilter, partialUpdateState);

    setTimeout(() => {
      onChange(newFilter);
    }, 100);
  }

  return (
    <div
      className={`boxcribe-search-activities__filter ${show ? "active" : ""}`}
    >
      <label>Price Range</label>
      <div className="boxcribe-search-activities__filter__range-wrapper">
        <Range
          values={priceRange}
          step={PRICE_STEP}
          min={PRICE_MIN}
          max={PRICE_MAX}
          onChange={handlePriceRangeChange}
          onFinalChange={handleSubmitPriceRangeChange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              className="boxcribe-search-activities__filter__price-range-track"
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values: priceRange,
                    colors: ["#EBEDEF", "#075FF7", "#EBEDEF"],
                    min: PRICE_MIN,
                    max: PRICE_MAX,
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: "36px",
                width: "36px",
                borderRadius: "50%",
                border: "2px solid #96A0AF",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // boxShadow: "0px 2px 6px #AAA",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#075FF7",
                }}
              >
                ${priceRange[index].toLocaleString("en-US")}.00
              </div>
              <div
                style={{
                  color: isDragged ? "#548BF4" : "#96A0AF",
                }}
              >
                {cilDollar}
              </div>
            </div>
          )}
        />
      </div>
      <label>Guest Score</label>
      {ratingOptions.map((option) => {
        const id = `rading-${option.value}`;

        return (
          <div
            key={option.value}
            className="boxcribe-search-activities__form-check"
          >
            <input
              type="checkbox"
              id={id}
              value={option.value}
              checked={option.checked}
              onChange={handleRatingChange}
            />
            <label htmlFor={id}>{option.label}</label>
          </div>
        );
      })}
      <label>Distance</label>
      <div className="boxcribe-search-activities__filter__range-wrapper">
        <Range
          values={distanceRange}
          step={DISTANCE_STEP}
          min={DISTANCE_MIN}
          max={DISTANCE_MAX}
          onChange={handleDistanceChange}
          onFinalChange={handleSubmitDistanceChange}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values: distanceRange,
                    colors: ["#EBEDEF", "#075FF7", "#EBEDEF"],
                    min: DISTANCE_MIN,
                    max: DISTANCE_MAX,
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: "36px",
                width: "36px",
                borderRadius: "50%",
                border: "2px solid #96A0AF",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#075FF7",
                }}
              >
                {distanceRange[index].toFixed(1)}mi
              </div>
              <div
                style={{
                  color: isDragged ? "#548BF4" : "#96A0AF",
                }}
              >
                {cilWalk}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
