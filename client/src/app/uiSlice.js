// Small piece of client-side state kept in Redux: which chat is open, which provider's portfolio is shown
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { chatBookingId: null, portfolioEmail: null },
  reducers: {
    openChat: (state, action) => { state.chatBookingId = action.payload; },
    closeChat: state => { state.chatBookingId = null; },
    showPortfolio: (state, action) => { state.portfolioEmail = action.payload; }
  }
});

export const { openChat, closeChat, showPortfolio } = uiSlice.actions;
export default uiSlice.reducer;
