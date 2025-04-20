import { toast } from "react-toastify";
import { envUtil } from "../envUtil";

// utils/fetchWrapper.js
const API_BASE_URL = envUtil.API_BASE_URL;

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // If 401 error, redirect to login page
    if (response.status === 401) {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        window.location.href = "/login";  // Redirect to login after toast
      }, 1500);
      return
    }

    const error = data?.message || response.statusText;
    throw new Error(error);
  }
  return data;
}

const fetchWrapper = {
  get: (url, headers = {}) =>
    fetch(`${API_BASE_URL}${url}`, { method: "GET", headers }).then(
      handleResponse
    ),

  post: (url, body, headers = {}) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (url, body, headers = {}) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (url, headers = {}) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers,
    }).then(handleResponse),
};

export default fetchWrapper;
