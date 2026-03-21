import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Smoothly scrolls to top on every route change.
 * Also enables smooth anchor-link scrolling across the app.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
