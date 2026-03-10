"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface PlaceResult {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Suggestion {
  placeId: string;
  description: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAddress(place: any): PlaceResult {
  const result: PlaceResult = { street: "", city: "", state: "", zip: "" };
  let streetNumber = "";
  let route = "";

  for (const c of place.address_components || []) {
    const type = c.types[0];
    if (type === "street_number") streetNumber = c.long_name;
    else if (type === "route") route = c.long_name;
    else if (type === "locality") result.city = c.long_name;
    else if (type === "administrative_area_level_1") result.state = c.short_name;
    else if (type === "postal_code") result.zip = c.long_name;
  }

  result.street = streetNumber ? `${streetNumber} ${route}` : route;
  return result;
}

// Load Google Maps script once
let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    if (scriptLoading) {
      loadCallbacks.push(resolve);
      return;
    }
    scriptLoading = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    win.__gw_places_cb = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=__gw_places_cb`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  });
}

export function useGooglePlaces(onSelect: (result: PlaceResult) => void) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteServiceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placesServiceRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Init Google services
  useEffect(() => {
    if (!API_KEY) return;
    loadGoogleScript().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      if (win.google?.maps?.places) {
        autocompleteServiceRef.current = new win.google.maps.places.AutocompleteService();
        // PlacesService needs a DOM element or map
        const div = document.createElement("div");
        placesServiceRef.current = new win.google.maps.places.PlacesService(div);
      }
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const search = useCallback((input: string) => {
    if (!autocompleteServiceRef.current || input.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "us" },
          types: ["address"],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (predictions: any[] | null) => {
          setLoading(false);
          if (predictions) {
            setSuggestions(
              predictions.slice(0, 5).map((p) => ({
                placeId: p.place_id,
                description: p.description,
              }))
            );
            setIsOpen(true);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        }
      );
    }, 250);
  }, []);

  const select = useCallback((placeId: string) => {
    if (!placesServiceRef.current) return;
    setIsOpen(false);
    setSuggestions([]);

    placesServiceRef.current.getDetails(
      { placeId, fields: ["address_components"] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (place: any, status: string) => {
        if (status === "OK" && place) {
          onSelectRef.current(extractAddress(place));
        }
      }
    );
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { suggestions, isOpen, loading, search, select, close, containerRef };
}
