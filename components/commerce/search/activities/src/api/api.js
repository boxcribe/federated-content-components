/**
 * Search tours and activities
 * @param body - Body
 */
export async function searchOffers(body) {
  return fetch(
    `${process.env.REACT_APP_BOXCRIBE_API_URL}/tours/offers/search`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_BOXCRIBE_API_KEY,
      },
      method: "POST",
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());
}
