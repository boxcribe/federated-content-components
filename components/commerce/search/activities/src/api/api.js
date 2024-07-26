const BOXCRIBE_API_URL = "https://api.cms.boxcribe.com/v1";

/**
 * Search tours and activities
 * @param body - Body
 * @param apiKey - [Optional] API Key
 */
export async function searchOffers(body, apiKey = null) {
  return fetch(
    `${process.env.REACT_APP_URL_API ?? BOXCRIBE_API_URL}/tours/offers/search`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY ?? apiKey,
      },
      method: "POST",
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());
}
