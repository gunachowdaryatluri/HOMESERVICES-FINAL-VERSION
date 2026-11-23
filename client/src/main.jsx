import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.js";
import App from "./App.jsx";
import "./style.css";

// If any component crashes while rendering, show the error instead of a blank page
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return <pre style={{ whiteSpace: "pre-wrap", color: "#b00020", background: "#fff3f3", padding: 16, margin: 16, border: "1px solid #b00020" }}>
      Something went wrong:{"\n"}{String((this.state.error && this.state.error.stack) || this.state.error)}
    </pre>;
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>
  </ErrorBoundary>
);