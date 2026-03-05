"use client";

import { useEffect, useRef } from "react";

interface PlaceResult {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAddress(place: any): PlaceResult {
  const result: PlaceResult = { street: "", city: "", state: "", zip: "" };
  let streetNumber = "";
  let route = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of (place.address_components || [])) {
    switch (c.types[0]) {
      case "street_number": streetNumber = c.long_name; break;
      case "route": route = c.long_name; break;
      case "locality": result.city = c.long_name; break;
      case "administrative_area_level_1": result.state = c.short_name; break;
      case "postal_code": result.zip = c.long_name; break;
    }
  }

  result.street = streetNumber ? `${streetNumber} ${route}` : route;
  return result;
}

export function useGooglePlaces(onSelect: (result: PlaceResult) => void) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Attach ref to input element — just stores it, no side effects
  const setInputRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
  };

  // Initialize autocomplete in useEffect — completely non-blocking
  useEffect(() => {
    if (initRef.current || !API_KEY || !inputRef.current) return;
    initRef.current = true;

    // Delay to let React finish rendering and input be interactive
    const timer = setTimeout(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;

        // If Google is already loaded, attach now
        if (win.google?.maps?.places) {
          attachToInput(win);
          return;
        }

        // Load script
        if (document.querySelector('script[src*="maps.googleapis.com"]')) return;

        win.__gw_places_cb = () => {
          try { attachToInput(win); } catch { /* silent */ }
        };

        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=__gw_places_cb`;
        s.async = true;
        s.defer = true;
        s.onerror = () => { /* silent — input works without autocomplete */ };
        document.head.appendChild(s);
      } catch {
        // Silent — input works as normal text field
      }
    }, 500);

    return () => clearTimeout(timer);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function attachToInput(win: any) {
      if (!inputRef.current) return;
      try {
        const ac = new win.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "us" },
          types: ["address"],
          fields: ["address_components"],
        });
        ac.addListener("place_changed", () => {
          try {
            const place = ac.getPlace();
            if (place?.address_components) {
              onSelectRef.current(extractAddress(place));
            }
          } catch { /* silent */ }
        });
      } catch {
        // Silent — autocomplete just won't work, typing still does
      }
    }
  }, []);

  return { setInputRef };
}
