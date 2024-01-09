import { DB_URL } from "../utils/constants";

export function useRequest() {
  const makeRequest = (
    url: string,
    method: string,
    payload?: any,
    isUpload: boolean = false
  ) => {
    let body = null;

    if (isUpload) {
      return fetch(`${DB_URL}${url}`, {
        method: method,
        headers: {},
        body: payload,
      });
    } else {
      return fetch(`${DB_URL}${url}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  };

  return makeRequest;
}
