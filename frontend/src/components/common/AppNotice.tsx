import { useState } from "react";

const DISMISS_KEY = "inventory-notice-dismissed";

export default function AppNotice() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) !== "true",
  );

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }

  return (
    <div className="app-notice" role="status">
      <div className="app-notice-inner">
        <span className="app-notice-icon" aria-hidden="true">
          <span className="app-notice-pulse" />
        </span>
        <div className="app-notice-content">
          <p className="app-notice-title">Backend may take a moment to respond</p>
          <p className="app-notice-text">
            This app uses Railway&apos;s free tier. After idle time the API sleeps —
            the first load can take <strong>30–60 seconds</strong>. Please wait; data
            will appear once the server wakes up.
          </p>
        </div>
        <button
          type="button"
          className="app-notice-dismiss"
          onClick={dismiss}
          aria-label="Dismiss notice"
        >
          ×
        </button>
      </div>
    </div>
  );
}
