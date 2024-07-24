import React, { useCallback, useEffect, useState } from "react";
import { setAnyState } from "./store";
import { getIntegrations, updateIntegration } from "./api/api";
import "./css/style.css";
import { getAuth } from "./auth/auth";

const widgetAnimationClass = "boxcribe-link-widget__move";
const sections = [
  "Select Integration",
  "Connect Integration",
  "Authorize Integration",
  "Integration Linked",
];
const environmentOptions = [
  {
    label: "Sandbox",
    value: "credentials_sandbox",
    selected: true,
  },
  {
    label: "Production",
    value: "credentials_production",
    selected: false,
  },
];
const authorizeEndpoints = [
  "Search Products",
  "Get Product Details",
  "Get Product Availability",
  "Create Booking",
  "Get Booking Details",
  "Cancel Booking",
];
const defaultEnv = "credentials_sandbox";

function titleCase(str) {
  return str
    .replace(/^[-_]*(.)/, (_, char) => char.toUpperCase())
    .replace(/[-_]+(.)/g, (_, char) => " " + char.toUpperCase());
}

export default function BoxcribeLink() {
  console.log("BoxcribeLink");
  const [state, setState] = useState({
    loading: true,
    success: "",
    error: "",
  });
  const [items, setItems] = useState([]);
  const [section, setSection] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const [env, setEnv] = useState(defaultEnv);
  const [credentials, setCredentials] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [auth, setAuth] = useState(null);
  const rightArrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
    >
      <path
        d="M11.246 0.792969L10.5389 1.50006L13.5388 4.49997H0.5V4.5V5.49997V5.5H13.5387L10.5389 8.49981L11.246 9.20691L15.4531 4.99994L11.246 0.792969Z"
        fill="#075FF7"
      />
    </svg>
  );
  const betweenArrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="9"
      viewBox="0 0 19 9"
      fill="none"
    >
      <path
        d="M14.746 0L14.0389 0.707094L17.0388 3.707H4V3.70703V4.707V4.70703H17.0387L14.0389 7.70684L14.746 8.41394L18.9531 4.20697L14.746 0Z"
        fill="#999999"
      />
      <path
        d="M4.20709 8.41394L4.91419 7.70685L1.91428 4.70694L14.9531 4.70694L14.9531 4.70691L14.9531 3.70694L14.9531 3.70691L1.91438 3.70691L4.91419 0.707096L4.20709 2.87525e-06L6.33103e-05 4.20697L4.20709 8.41394Z"
        fill="#999999"
      />
    </svg>
  );
  const betweenArrowBlueIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="9"
      viewBox="0 0 19 9"
      fill="none"
    >
      <path
        d="M14.746 0L14.0389 0.707094L17.0388 3.707H4V3.70703V4.707V4.70703H17.0387L14.0389 7.70684L14.746 8.41394L18.9531 4.20697L14.746 0Z"
        fill="#075FF7"
      />
      <path
        d="M4.20709 8.41394L4.91419 7.70685L1.91428 4.70694L14.9531 4.70694L14.9531 4.70691L14.9531 3.70694L14.9531 3.70691L1.91438 3.70691L4.91419 0.707096L4.20709 2.87525e-06L6.33103e-05 4.20697L4.20709 8.41394Z"
        fill="#075FF7"
      />
    </svg>
  );
  const boxcribeLogoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="45"
      viewBox="0 0 29 45"
      fill="none"
    >
      <path
        d="M16.8752 0L22.5001 3.24742V9.74227L28.125 12.9897V32.2423L5.62491 45L0 41.7526L22.5001 28.9948V9.74227L16.8752 12.9897V0Z"
        fill="#191C2C"
      />
      <path
        d="M11.2504 9.74219L5.625 12.9896V19.2525L11.2504 16.237V9.74219Z"
        fill="#191C2C"
      />
      <path
        d="M16.8753 19.2522L5.625 25.7475V32.2423L16.8753 25.7475V19.2522Z"
        fill="#191C2C"
      />
    </svg>
  );

  useEffect(() => {
    getAuth().then((newAuth) => setAuth(newAuth));
  }, []);

  useEffect(() => {
    if (!auth) return;

    loadIntegrations();
  }, [auth]);

  useEffect(() => {
    if (selectedItem) {
      setCredentials(selectedItem[env]);
    }
  }, [env]);

  const loadIntegrations = useCallback(
    async function loadIntegrations() {
      setAnyState(setState, {
        loading: true,
      });

      try {
        const response = await getIntegrations(auth);

        if (response?.message) {
          console.error(`Unable to get integrations: ${response?.message}`);
        } else {
          setItems(response.results ?? []);
        }
      } catch (e) {
        console.error(`Unable to get integrations: ${e?.message}`);
      }

      setAnyState(setState, {
        loading: false,
      });
    },
    [auth],
  );

  function handleSectionChange(sectionNumber) {
    if (sectionNumber === 0) {
      setSelectedItem();
      setCredentials({});
      setEnv(defaultEnv);
    }

    setSection(sectionNumber);
  }

  function handleSelectIntegration(item) {
    setSelectedItem(item);
    setCredentials(item?.credentials_sandbox);
    setSection(1);
  }

  function handleIntegrationChange(key, event) {
    setAnyState(setCredentials, {
      [key]: event.target.value,
    });
  }

  function handleEnvChange([{ value }]) {
    setEnv(value);
  }

  async function updateItem(id, partialIntegration) {
    const response = await updateIntegration(auth, id, partialIntegration);

    const updatedState = {
      success: "",
      error: "",
    };

    if (response && response.id) {
      await loadIntegrations();
    } else if (response && response.message) {
      updatedState.error = response.message;
    } else {
      updatedState.error = "Something went wrong!";
    }

    setAnyState(setState, updatedState);
  }

  async function handleSubmit() {
    const partialIntegration = {
      [env]: credentials,
    };

    setAnyState(setState, {
      saving: true,
    });

    await updateItem(selectedItem.id, partialIntegration);

    setAnyState(setState, {
      saving: false,
    });
    setSection(3);

    setTimeout(() => {
      handleSectionChange(0);
    }, 5000);
  }

  return (
    <div className="boxcribe-link-widget">
      <div className="boxcribe-link-widget__body">
        <div className="boxcribe-link-widget__header">
          <div>
            <div className="boxcribe-link-widget__title">Link</div>
            <div className="boxcribe-link-widget__secondary-text">
              {section + 1}. {sections[section]}
            </div>
          </div>
          <div>
            <div className="boxcribe-link-widget__steps">
              {sections.map((sectionNumber, index) => (
                <div
                  key={index}
                  className={`boxcribe-link-widget__step ${
                    section === index ? "boxcribe-link-widget__step-active" : ""
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            {section > 0 && section < 3 && (
              <div
                className="boxcribe-link-widget__step-back"
                onClick={() => handleSectionChange(section - 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g opacity="0.7">
                    <path
                      d="M15.5419 7.50003H2.50309L5.50293 4.50018L4.79584 3.79309L0.588867 8.00006L4.79584 12.207L5.50293 11.4999L2.50302 8.50003H15.5419V7.50003Z"
                      fill="#075FF7"
                    />
                  </g>
                </svg>
                Back
              </div>
            )}
          </div>
        </div>
        <div
          className={`boxcribe-link-widget__track ${widgetAnimationClass}-${section}`}
        >
          <section className="boxcribe-link-widget__section boxcribe-link-widget__section-1">
            <div className="boxcribe-link-widget__categories boxcribe-link-widget__scrollbar">
              <div
                className={`boxcribe-link-widget__category ${
                  activeCategory === "All"
                    ? "boxcribe-link-widget__category-active"
                    : ""
                }`}
                onClick={() => setActiveCategory("All")}
              >
                All
              </div>
              {auth?.categories.results.map(({ name }, index) => (
                <div
                  key={index}
                  className={`boxcribe-link-widget__category ${
                    activeCategory === name
                      ? "boxcribe-link-widget__category-active"
                      : ""
                  }`}
                  onClick={() => setActiveCategory(name)}
                >
                  {name}
                </div>
              ))}
            </div>
            <div className="boxcribe-link-widget__integrations-list boxcribe-link-widget__scrollbar">
              <div className="boxcribe-link-widget__integrations-list__heading">
                Integrations
              </div>
              {state.loading && (
                <div className="boxcribe-link-widget__spinner-grow"></div>
              )}
              <ul>
                {!state.loading &&
                  items
                    .filter(
                      (item) =>
                        activeCategory === "All" ||
                        item.category.name === activeCategory,
                    )
                    .map((item, index) => (
                      <li
                        key={index}
                        className="boxcribe-link-widget__integration"
                        onClick={() => handleSelectIntegration(item)}
                      >
                        <img
                          src={item.logo}
                          width={24}
                          height={24}
                          className="boxcribe-link-widget__integration-icon"
                          alt={item.name}
                        />
                        <span className="boxcribe-link-widget__integration-name">
                          {item.name}
                        </span>
                      </li>
                    ))}
              </ul>
            </div>
            <div className="boxcribe-link-widget__section-1-footer">
              <svg width={20} height={32}>
                <g>
                  <path
                    d="M11.8766 0L15.8354 2.30928V6.92783L19.7941 9.23711V22.9278L3.95876 32L0 29.6907L15.8354 20.6186V6.92783L11.8766 9.23711V0Z"
                    fill="#191C2C"
                  />
                  <path
                    d="M7.91776 6.92773L3.95868 9.23701V13.6906L7.91776 11.5463V6.92773Z"
                    fill="#191C2C"
                  />
                  <path
                    d="M11.8766 13.6904L3.95868 18.3093V22.9279L11.8766 18.3093V13.6904Z"
                    fill="#191C2C"
                  />
                </g>
              </svg>
            </div>
          </section>
          <section className="boxcribe-link-widget__section">
            {selectedItem && (
              <div className="boxcribe-link-widget__section-scrollable boxcribe-link-widget__section-2">
                <div className="boxcribe-link-widget__section-2__icons">
                  <img
                    src={selectedItem?.logo}
                    width={45}
                    height={45}
                    alt={selectedItem?.name}
                  />
                  {betweenArrowIcon}
                  {boxcribeLogoIcon}
                </div>
                <div className="boxcribe-link-widget__section-2__connection-description">
                  <h6>Connect {selectedItem?.name}</h6>
                  <small className="text-body-secondary">
                    Enter your {selectedItem?.name} API credentials
                  </small>
                </div>
                <div className="boxcribe-link-widget__section-2__form">
                  <div>
                    <div className="boxcribe-link-widget__section-2__form-radio-group">
                      {environmentOptions.map((environmentOption) => (
                        <label key={environmentOption.value}>
                          <input
                            type="radio"
                            name="env"
                            checked={env === environmentOption.value}
                            onChange={() =>
                              handleEnvChange([
                                { value: environmentOption.value },
                              ])
                            }
                          />
                          {environmentOption.label}
                        </label>
                      ))}
                    </div>
                    {Object.entries(credentials).map(
                      ([label, value], index) => (
                        <div key={label}>
                          <label>{titleCase(label)}:</label>
                          <div>
                            <input
                              name="asd"
                              type={index === 0 ? "text" : "password"}
                              placeholder={`eg. ${titleCase(label)}`}
                              value={value}
                              autoComplete="off"
                              onChange={(e) =>
                                handleIntegrationChange(label, e)
                              }
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="boxcribe-link-widget__section-1-footer">
                    <button
                      type="submit"
                      className="boxcribe-link-widget__btn-primary"
                      onClick={() => setSection(2)}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className="boxcribe-link-widget__section">
            <div className="boxcribe-link-widget__section-3">
              <div className="boxcribe-link-widget__section-2__icons">
                <img
                  src={selectedItem?.logo}
                  width={45}
                  height={45}
                  alt={selectedItem?.name}
                />
                {betweenArrowIcon}
                {boxcribeLogoIcon}
              </div>
              <div className="boxcribe-link-widget__section-2__connection-description">
                <h6>Authorize {selectedItem?.name}</h6>
                <small className="text-body-secondary">
                  Boxcribe is requesting access to your {selectedItem?.name}{" "}
                  account to the following API endpoints
                </small>
              </div>
              <div className="boxcribe-link-widget__section-2__form">
                <ul className="boxcribe-link-widget__section-3__box">
                  {authorizeEndpoints.map((authorizeEndpoint) => (
                    <li key={authorizeEndpoint}>
                      {rightArrowIcon}
                      {authorizeEndpoint}
                    </li>
                  ))}
                </ul>
                <div className="boxcribe-link-widget__section-1-footer">
                  <button
                    type="submit"
                    disabled={state.saving}
                    className="boxcribe-link-widget__btn-primary"
                    onClick={handleSubmit}
                  >
                    {state.saving ? "Allow..." : "Allow"}
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className="boxcribe-link-widget__section">
            <div className="boxcribe-link-widget__section-4">
              <div className="boxcribe-link-widget__section-4__success">
                <div className="boxcribe-link-widget__section-2__icons">
                  <img
                    src={selectedItem?.logo}
                    width={45}
                    height={45}
                    alt={selectedItem?.name}
                  />
                  {betweenArrowBlueIcon}
                  {boxcribeLogoIcon}
                </div>
                <div className="boxcribe-link-widget__section-2__connection-description">
                  <h6>
                    Congratulations, {selectedItem?.name} Successfully Linked!
                  </h6>
                  <small className="text-body-secondary">
                    Boxcribe is requesting access to your {selectedItem?.name}{" "}
                    account to the following API endpoints
                  </small>
                </div>
              </div>
              <div className="boxcribe-link-widget__section-2__form-footer">
                <svg width={20} height={32}>
                  <g>
                    <path
                      d="M11.8766 0L15.8354 2.30928V6.92783L19.7941 9.23711V22.9278L3.95876 32L0 29.6907L15.8354 20.6186V6.92783L11.8766 9.23711V0Z"
                      fill="#191C2C"
                    />
                    <path
                      d="M7.91776 6.92773L3.95868 9.23701V13.6906L7.91776 11.5463V6.92773Z"
                      fill="#191C2C"
                    />
                    <path
                      d="M11.8766 13.6904L3.95868 18.3093V22.9279L11.8766 18.3093V13.6904Z"
                      fill="#191C2C"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
