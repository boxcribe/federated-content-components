import { getToken } from "../api/api";

const key = "boxcribe_auth";

function getAuthLocalStorage() {
  const authString = localStorage.getItem(key);

  if (!authString) return null;

  try {
    return JSON.parse(authString);
  } catch {
    updateAuthLocalStorage(null);
    return null;
  }
}

export function updateAuthLocalStorage(newAuth) {
  localStorage.setItem(key, JSON.stringify(newAuth));
}

export async function getAuth() {
  const auth = getAuthLocalStorage();

  if (!auth) {
    try {
      const response = await getToken();

      if (
        response &&
        response.tokens &&
        response.tokens.access &&
        response.tokens.access.token
      ) {
        updateAuthLocalStorage(response);

        return response;
      }
    } catch (e) {
      console.error(`Unable to login to Boxcribe: ${e.message}`);
    }
  }

  return auth;
}
