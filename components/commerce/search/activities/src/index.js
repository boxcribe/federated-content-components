import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";
import "./css/style.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useState } from "react";
import cilLocationPin from "./assets/icons/cil-location-pin.svg";
import cilCalendar from "./assets/icons/cil-calendar.svg";
import { searchOffers } from "./api/api";
import BoxcribeSearchActivityItem from "./components/item/BoxcribeSearchActivitiesItem";

function setAnyState(setStateFn, partialUpdatedState) {
  setStateFn((prevState) => ({
    ...prevState,
    ...partialUpdatedState,
  }));
}

const todayDate = new DateObject();
const defaultStartDate = new DateObject().add(1, "day");
const defaultEndDate = new DateObject().add(7, "day");
const defaultItems = Array.from({ length: 9 }, (_, index) => ({
  offer_id: index,
}));

export default function BoxcribeSearchActivities() {
  const [date, setDate] = useState([defaultStartDate, defaultEndDate]);
  const [state, setState] = useState({
    loading: false,
    location: {
      lat: 0,
      lng: 0,
    },
    items: [],
  });

  async function handleLocationChange(searchLocation) {
    if (!searchLocation?.value.place_id) return;

    const location = await geocodeByPlaceId(
      searchLocation?.value.place_id,
    ).then(([geocode]) => getLatLng(geocode));

    setAnyState(setState, {
      location,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const [startDate, endDate] = date;

    setAnyState(setState, {
      loading: true,
      items: defaultItems,
    });

    try {
      const response = await searchOffers({
        location_latitude: state.location.lat,
        location_longitude: state.location.lng,
        location_radius: 10,
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        adults: 1,
        children: 0,
        sort_by: "rating",
        sort_order: "desc",
        page: 1,
        limit: 10,
      });

      return setAnyState(setState, {
        loading: false,
        items: response.offers,
      });
    } catch (e) {
      console.error(`Error while searching: ${e.message}`);
      return setAnyState(setState, {
        loading: false,
      });
    }
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
              apiKey={process.env.REACT_APP_GOOGLE_PLACES_API_ID ?? ""}
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
      <div className="boxcribe-search-activities__content">
        {state.items.map((item) => (
          <BoxcribeSearchActivityItem
            key={item.offer_id}
            loading={state.loading}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
