(function trackflowTracker() {
  "use strict";

  var STORAGE_KEY = "trackflow_session_id";
  var DNT_ENABLED =
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1" ||
    navigator.msDoNotTrack === "1";

  if (DNT_ENABLED) {
    return;
  }

  function currentScript() {
    if (document.currentScript) {
      return document.currentScript;
    }

    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  }

  function getEndpoint() {
    if (window.TRACKFLOW_ENDPOINT) {
      return window.TRACKFLOW_ENDPOINT;
    }

    var script = currentScript();

    if (script && script.src) {
      try {
        return new URL("/api/events", script.src).toString();
      } catch (error) {
        return "/api/events";
      }
    }

    return "/api/events";
  }

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "tf_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2);
  }

  function getSessionId() {
    try {
      var existing = window.localStorage.getItem(STORAGE_KEY);

      if (existing) {
        return existing;
      }

      var created = uuid();
      window.localStorage.setItem(STORAGE_KEY, created);
      return created;
    } catch (error) {
      return uuid();
    }
  }

  var endpoint = getEndpoint();
  var sessionId = getSessionId();
  var lastPageUrl = "";

  function payload(eventType, extra) {
    var data = {
      sessionId: sessionId,
      eventType: eventType,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };

    if (extra) {
      Object.keys(extra).forEach(function assignExtra(key) {
        data[key] = extra[key];
      });
    }

    return data;
  }

  function send(data) {
    var body = JSON.stringify(data);

    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      var queued = navigator.sendBeacon(endpoint, blob);

      if (queued) {
        return;
      }
    }

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body,
      credentials: "omit",
      keepalive: true
    }).catch(function ignoreNetworkError() {});
  }

  function trackPageView() {
    var pageUrl = window.location.href;

    if (lastPageUrl === pageUrl) {
      return;
    }

    lastPageUrl = pageUrl;
    send(payload("page_view"));
  }

  function trackClick(event) {
    send(
      payload("click", {
        x: Math.max(0, Math.round(event.clientX + window.scrollX)),
        y: Math.max(0, Math.round(event.clientY + window.scrollY))
      })
    );
  }

  function patchHistory(methodName) {
    var original = window.history[methodName];

    window.history[methodName] = function patchedHistoryMethod() {
      var result = original.apply(this, arguments);
      setTimeout(trackPageView, 0);
      return result;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageView, { once: true });
  } else {
    trackPageView();
  }

  document.addEventListener("click", trackClick, { capture: true, passive: true });
  patchHistory("pushState");
  patchHistory("replaceState");
  window.addEventListener("popstate", trackPageView);
})();
