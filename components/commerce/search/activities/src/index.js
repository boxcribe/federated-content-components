import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import "./css/style.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import React, { useEffect, useState } from "react";
import cilLocationPin from "./assets/icons/cil-location-pin.svg";
import cilCalendar from "./assets/icons/cil-calendar.svg";
import { searchOffers } from "./api/api";
import BoxcribeSearchActivityItem from "./components/item/BoxcribeSearchActivitiesItem";
import { cilFilter } from "./assets/js/cilFilter";
import BoxcribeSearchActivitiesSortBy from "./components/sort-by/BoxcribeSearchActivitiesSortBy";
import BoxcribeSearchActivitiesDisplay, {
  DISPLAY_OPTIONS,
} from "./components/display/BoxcribeSearchActivitiesDisplay";
import BoxcribeSearchActivitiesFilter from "./components/filter/BoxcribeSearchActivitiesFilter";
import { setAnyState } from "./state/state";
import { cilSearch } from "./assets/js/cilSearch";
import { cilFilterX } from "./assets/js/cilFilterX";
import { cilClearAll } from "./assets/js/cilClearAll";

const todayDate = new DateObject();
const defaultStartDate = new DateObject().add(1, "day");
const defaultEndDate = new DateObject().add(7, "day");
const defaultItems = Array.from({ length: 9 }, (_, index) => ({
  offer_id: index,
}));
const initialSortAndFilter = {
  sort_by: "rating",
  sort_order: "desc",
};

export default function BoxcribeSearchActivities({ apiKey }) {
  const [date, setDate] = useState([defaultStartDate, defaultEndDate]);
  const [state, setState] = useState({
    loading: false,
    location: {
      lat: 0,
      lng: 0,
    },
    items: [],
    notFound: false,
    firstSearch: true,
    resetFilter: null,
  });
  const [display, setDisplay] = useState(DISPLAY_OPTIONS.GRID);
  const [showFilter, setShowFilter] = useState(false);
  const [sortAndFilter, setSortAndFilter] = useState(initialSortAndFilter);

  useEffect(() => {
    if (state.firstSearch || !state.location.lat || !state.location.lng) return;

    loadItems();
  }, [sortAndFilter]);

  async function handleLocationChange(searchLocation) {
    if (!searchLocation?.value.place_id) return;

    const location = await geocodeByPlaceId(
      searchLocation?.value.place_id,
    ).then(([geocode]) => getLatLng(geocode));

    setAnyState(setState, {
      location,
    });
  }

  async function loadItems(firstSearch = false) {
    const [startDate, endDate] = date;

    setAnyState(setState, {
      firstSearch,
      loading: true,
      items: defaultItems,
      notFound: false,
    });

    try {
      const response = await searchOffers(
        {
          location_latitude: state.location.lat,
          location_longitude: state.location.lng,
          location_radius: 100,
          start_date: startDate.format("YYYY-MM-DD"),
          end_date: endDate.format("YYYY-MM-DD"),
          adults: 1,
          children: 0,
          page: 1,
          limit: 50,
          ...sortAndFilter,
        },
        apiKey,
      );

      if (response?.offers) {
        return setAnyState(setState, {
          loading: false,
          firstSearch: false,
          items: response?.offers ?? [],
        });
      }

      if (response?.message === "No offers found") {
        return setAnyState(setState, {
          loading: false,
          items: [],
          notFound: true,
        });
      }
    } catch (e) {
      console.error(`Error while searching: ${e.message}`);
      return setAnyState(setState, {
        loading: false,
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSortAndFilter(initialSortAndFilter);
    await loadItems(true);
  }

  async function handleSortChange(sort) {
    setAnyState(setSortAndFilter, sort);
  }

  function handleDisplayChange(value) {
    setDisplay(value);
  }

  async function handleFilterChange(filter) {
    setAnyState(setSortAndFilter, filter);
  }

  function handleResetFilter() {
    setAnyState(setState, {
      resetFilter: Math.random(),
    });
  }

  return (
    <div className="boxcribe-search-activities">
      <form
        className="boxcribe-search-activities__form"
        onSubmit={handleSubmit}
      >
        <div className="boxcribe-search-activities__form-group">
          <label>Destination</label>
          <div className="boxcribe-search-activities__form-input-group">
            <div className="boxcribe-search-activities__form-input-group__icon-placeholder">
              <img
                src={cilLocationPin}
                alt="Destination"
                className="boxcribe-icon"
              />
            </div>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyC8_8ESW8I-39vlbVUBU222yEEEhgiZV1U"
              debounce={200}
              selectProps={{
                placeholder: "Where are you going?",
                className:
                  "boxcribe-search-activities__google-places-autocomplete",
                required: true,
                onChange: handleLocationChange,
              }}
            />
          </div>
        </div>
        <div className="boxcribe-search-activities__form-group">
          <label>Dates</label>
          <div className="boxcribe-search-activities__form-input-group">
            <div className="boxcribe-search-activities__form-input-group__icon-placeholder">
              <img src={cilCalendar} alt="Dates" className="boxcribe-icon" />
            </div>
            <DatePicker
              range={true}
              numberOfMonths={2}
              highlightToday={true}
              minDate={todayDate}
              value={date}
              onChange={setDate}
              arrow={false}
              dateSeparator=" - "
            />
          </div>
        </div>
        <div className="boxcribe-search-activities__form-group">
          <label>&nbsp;</label>
          <div>
            <button
              type="submit"
              className="boxcribe-search-activities__btn-primary"
            >
              SEARCH
            </button>
          </div>
        </div>
      </form>
      {!state.firstSearch && (state.location.lat || state.location.lng) && (
        <div className="boxcribe-search-activities__controls">
          <button
            className={`boxcribe-search-activities__btn-ghost-primary boxcribe-search-activities__controls-filter ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? cilFilterX : cilFilter}
            Filter
          </button>
          {showFilter && (
            <button
              className="boxcribe-search-activities__btn-ghost-primary boxcribe-search-activities__controls-filter"
              onClick={handleResetFilter}
            >
              {cilClearAll} Clear All
            </button>
          )}
          <BoxcribeSearchActivitiesSortBy onChange={handleSortChange} />
          <BoxcribeSearchActivitiesDisplay
            initialState={display}
            onChange={handleDisplayChange}
          />
        </div>
      )}
      <div className="boxcribe-search-activities__body">
        {!state.firstSearch && (
          <BoxcribeSearchActivitiesFilter
            show={showFilter}
            onChange={handleFilterChange}
            reset={state.resetFilter}
          />
        )}
        <div className={`boxcribe-search-activities__content ${display}`}>
          {!state.notFound &&
            state.items.map((item) => (
              <BoxcribeSearchActivityItem
                key={item.offer_id}
                loading={state.loading}
                item={item}
              />
            ))}
          {state.notFound && (
            <div className="boxcribe-search-activities__no-results-found">
              {cilSearch}
              <h1>
                We didn't find any results that met your search criteria.
                <br />
                Please try again.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
