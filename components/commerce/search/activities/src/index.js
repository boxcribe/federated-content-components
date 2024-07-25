import { createRoot } from "react-dom/client";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "./css/style.css";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useState } from "react";
import cilLocationPin from "./assets/icons/cil-location-pin.svg";
import cilCalendar from "./assets/icons/cil-calendar.svg";

const todayDate = new DateObject();
const defaultStartDate = new DateObject().add(1, "day");
const defaultEndDate = new DateObject().add(7, "day");

export default function BoxcribeSearchActivities() {
  const [date, setDate] = useState([defaultStartDate, defaultEndDate]);

  function handleSubmit(event) {
    event.preventDefault();
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
              apiKey="****"
              selectProps={{
                placeholder: "Where are you going?",
                className:
                  "boxcribe-search-activities__google-places-autocomplete",
              }}
              className="adrian"
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
    </div>
  );
}

// TODO: remove before publish
createRoot(document.getElementById("root")).render(
  <BoxcribeSearchActivities />,
);
