import { updateAuthLocalStorage } from "../auth/auth";

/**
 * Validation on the reponse
 * @param {Object} response - Response JSON object
 * @return {Promise} resolve
 */
const handleResolve = (response, resolve) => {
  if (
    response &&
    response.message &&
    response.message === "Please authenticate"
  ) {
    console.log("Boxcribe Token expired, login again");
    updateAuthLocalStorage(null);
  }

  if (resolve) {
    resolve(response);
  } else {
    return response;
  }
};

/**
 * Validation on the reject error
 * @param {Object} error - Error JSON object
 * @return {Promise} reject
 */
const handleReject = (error, reject) => {
  if (error && error.message && error.message === "Please authenticate") {
    updateAuthLocalStorage(null);
  }

  if (reject) {
    reject(error);
  } else {
    return error;
  }
};
// Auth
/**
 * Login
 * @param {Promise} resolve - Callback function for success
 * @param {Promise} reject - Callback function for error
 */
export async function getToken(resolve, reject) {
  return fetch(`${process.env.REACT_APP_BOXCRIBE_API_URL}/auth/login`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: process.env.REACT_APP_BOXCRIBE_USERNAME,
      password: process.env.REACT_APP_BOXCRIBE_PASSWORD,
    }),
  })
    .then((res) => res.json())
    .then((response) => handleResolve(response, resolve))
    .catch((error) => handleReject(error, reject));
}

/**
 * Get integrations
 * @param {Object} auth - Context
 * @param {Promise} resolve - Callback function for success
 * @param {Promise} reject - Callback function for error
 */
export async function getIntegrations(auth, resolve, reject) {
  const options = {
    available: true,
    tenant: process.env.REACT_APP_BOXCRIBE_TENANT,
  };

  return fetch(
    `${process.env.REACT_APP_BOXCRIBE_API_URL}/integrations?${new URLSearchParams(options)}`,
    {
      headers: {
        Authorization: `Bearer ${auth.tokens.access.token}`,
      },
      method: "GET",
    },
  )
    .then((res) => res.json())
    .then((response) => handleResolve(response, resolve))
    .catch((error) => handleReject(error, reject));
}

/**
 * Update integration based on id
 * @param {Object} auth - Context
 * @param {String} id - Integration id
 * @param {Object} integration - Integration object
 * @param {Promise} resolve - Callback function for success
 * @param {Promise} reject - Callback function for error
 */
export async function updateIntegration(
  auth,
  id,
  integration,
  resolve,
  reject,
) {
  return fetch(`${process.env.REACT_APP_BOXCRIBE_API_URL}/integrations/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.tokens.access.token}`,
    },
    method: "PATCH",
    body: JSON.stringify(integration),
  })
    .then((res) => res.json())
    .then((response) => handleResolve(response, resolve))
    .catch((error) => handleReject(error, reject));
}
