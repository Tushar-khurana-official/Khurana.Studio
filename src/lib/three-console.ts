"use client";

import { setConsoleFunction } from "three";

/**
 * Interim shim for R3F v9, which still constructs `new THREE.Clock()` internally
 * on every Canvas mount. three.js r183+ deprecates Clock in favour of Timer and
 * logs a warning from inside that constructor (we don't call it ourselves).
 * R3F v10 switches to THREE.Timer and removes the warning upstream.
 *
 * Filter only the exact known deprecation message and pass everything else
 * through untouched. Delete this file once @react-three/fiber v10 is in use.
 */
if (typeof window !== "undefined") {
  setConsoleFunction((type, message, ...params) => {
    if (
      type === "warn" &&
      typeof message === "string" &&
      message.includes("Clock: This module has been deprecated. Please use THREE.Timer instead.")
    ) {
      return;
    }
    const method = console[type] ?? console.log;
    method.apply(console, [message, ...params]);
  });
}