// All calls to the backend, defined once with RTK Query. Components use the generated hooks.
// Tags make the data refresh by itself: a mutation "invalidates" the tags whose data it changed.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api", credentials: "same-origin" }); // cookie (JWT) is sent automatically

// Turns every failure into { status, message } so components can show the server's text
const baseQuery = async (args, api, extra) => {
  const result = await rawBaseQuery(args, api, extra);
  if (result.error) {
    const { status, data } = result.error;
    let message = data && data.error;
    if (!message) {
      // No JSON error from our API: usually the backend is not running (Vite answers 500/502/503/504 with an empty body)
      if (status === "FETCH_ERROR" || [500, 502, 503, 504].includes(status)) message = "Cannot reach the backend. Start it with 'npm run dev' (or 'npm start') and make sure port 3000 is free.";
      else if (status === "PARSING_ERROR") message = "The server sent an unexpected reply. Check that the backend is running on port 3000.";
      else message = "Request failed (" + status + ")";
    }
    result.error = { status, message };
  }
  return result;
};

const body = (url, method, data) => ({ url, method, body: data });

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Me", "Bookings", "Providers", "ProviderSummary", "AdminSummary", "Messages"],
  endpoints: b => ({
    // ----- account -----
    getMe: b.query({ query: () => "/me", providesTags: ["Me"] }),
    login: b.mutation({ query: d => body("/login", "POST", d), invalidatesTags: ["Me"] }),
    signup: b.mutation({ query: d => body("/signup", "POST", d) }),
    logout: b.mutation({ query: () => body("/logout", "POST") }),

    // ----- customer -----
    getProviders: b.query({ query: ({ category, q }) => ({ url: "/providers", params: { category, q } }), providesTags: ["Providers"] }),
    getMyBookings: b.query({ query: () => "/bookings/mine", providesTags: ["Bookings"] }),
    createBooking: b.mutation({ query: d => body("/bookings", "POST", d), invalidatesTags: ["Bookings", "ProviderSummary", "AdminSummary"] }),
    payBooking: b.mutation({ query: id => body(`/bookings/${id}/pay`, "POST"), invalidatesTags: ["Bookings", "ProviderSummary", "AdminSummary"] }),
    reviewBooking: b.mutation({ query: ({ id, ...d }) => body(`/bookings/${id}/review`, "POST", d), invalidatesTags: ["Bookings", "Providers", "ProviderSummary"] }),
    fileComplaint: b.mutation({ query: d => body("/complaints", "POST", d), invalidatesTags: ["AdminSummary"] }),
    getWeather: b.query({ query: ({ city, date }) => ({ url: "/weather", params: { city, date } }) }), // third-party API (via our server)

    // ----- chat -----
    getMessages: b.query({ query: id => `/bookings/${id}/messages`, providesTags: (r, e, id) => [{ type: "Messages", id }] }),
    sendMessage: b.mutation({ query: ({ id, text }) => body(`/bookings/${id}/messages`, "POST", { text }), invalidatesTags: (r, e, { id }) => [{ type: "Messages", id }] }),

    // ----- provider -----
    getProviderSummary: b.query({ query: () => "/provider/summary", providesTags: ["ProviderSummary"] }),
    respondBooking: b.mutation({ query: ({ id, status }) => body(`/provider/bookings/${id}`, "PUT", { status }), invalidatesTags: ["ProviderSummary", "Bookings", "AdminSummary"] }),
    saveProfile: b.mutation({ query: d => body("/provider/profile", "PUT", d), invalidatesTags: ["ProviderSummary", "Providers"] }),
    addPortfolio: b.mutation({ query: d => body("/provider/portfolio", "POST", d), invalidatesTags: ["ProviderSummary", "Providers"] }),
    removePortfolio: b.mutation({ query: n => body(`/provider/portfolio/${n}`, "DELETE"), invalidatesTags: ["ProviderSummary", "Providers"] }),

    // ----- admin -----
    getAdminSummary: b.query({ query: () => "/admin/summary", providesTags: ["AdminSummary"] }),
    setBookingStatus: b.mutation({ query: ({ id, status }) => body(`/bookings/${id}/status`, "PUT", { status }), invalidatesTags: ["AdminSummary", "Bookings", "ProviderSummary"] }),
    verifyProvider: b.mutation({ query: ({ email, verified }) => body(`/admin/providers/${encodeURIComponent(email)}/verify`, "PUT", { verified }), invalidatesTags: ["AdminSummary", "Providers"] }),
    resolveComplaint: b.mutation({ query: id => body(`/complaints/${id}/resolve`, "PUT"), invalidatesTags: ["AdminSummary"] })
  })
});

export const {
  useGetMeQuery, useLoginMutation, useSignupMutation, useLogoutMutation,
  useGetProvidersQuery, useGetMyBookingsQuery, useCreateBookingMutation, usePayBookingMutation,
  useReviewBookingMutation, useFileComplaintMutation, useGetWeatherQuery,
  useGetMessagesQuery, useSendMessageMutation,
  useGetProviderSummaryQuery, useRespondBookingMutation, useSaveProfileMutation, useAddPortfolioMutation, useRemovePortfolioMutation,
  useGetAdminSummaryQuery, useSetBookingStatusMutation, useVerifyProviderMutation, useResolveComplaintMutation
} = api;

// Runs a mutation and shows the server's message on failure (returns the data, or null if it failed)
export async function run(promise, successMessage) {
  try {
    const data = await promise.unwrap();
    if (successMessage) alert(successMessage);
    return data;
  } catch (e) {
    alert((e && e.message) || "Request failed");
    return null;
  }
}
