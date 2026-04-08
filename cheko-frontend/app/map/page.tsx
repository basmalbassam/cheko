"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


// type
type RestaurantType = {
    id: number;
    name: string;
    image: string;
    lat: number;
    lng: number;
};


// Override MapLibre popup default white rectangle
const popupStyles = ` .maplibregl-popup-content 
            {
             padding: 0 !important; border-radius: 16px !important;
             box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
             overflow: hidden !important; background: transparent !important;
            }
             .maplibregl-popup-tip { display: none !important; }
             .maplibregl-popup-close-button { display: none !important; } `;


export default function MapPage() {

    const mapContainer = useRef<HTMLDivElement | null>(null);               // points to the <div> in the DOM where the map renders
    const map = useRef<maplibregl.Map | null>(null);                                // holds the MapLibre map instance
    const markersRef = useRef<{ marker: maplibregl.Marker; id: number }[]>([]);  // array of all current markers on the map

    const [restaurants, setRestaurants] = useState<RestaurantType[]>([]); // list of all restaurants fetched from backend, triggers marker update
    const [allCategories, setAllCategories] = useState<string[]>([]);     // returns all enum values for the dropdown

    const [searchInput, setSearchInput] = useState("");           // what the user is typing
    const [activeSearch, setActiveSearch] = useState("");         // what was submitted
    const [selectedCategory, setSelectedCategory] = useState(""); // triggers backend call when changed



    // fetch categories from backend enum for dropdown
    useEffect(() => {
        fetch("/api/menu/categories")
            .then((res) => res.json())
            .then((data) => setAllCategories(data));
    }, []);

    // fetch restaurants from backend with search and category filter
    useEffect(() => {
        const params = new URLSearchParams();
        if (activeSearch) params.set("search", activeSearch);
        if (selectedCategory) params.set("category", selectedCategory);

        fetch(`/api/restaurants?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => setRestaurants(data));
    }, [activeSearch, selectedCategory]);



    // initialize the map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    riyadh: {
                        type: "vector",
                        tiles: ["http://localhost:8090/services/riyadh/tiles/{z}/{x}/{y}.pbf"],
                        minzoom: 0,
                        maxzoom: 13,
                    },
                },
                layers: [
                    {
                        id: "background",
                        type: "background",
                        paint: { "background-color": "#F2EFE9" },
                    },
                    {
                        id: "buildings",
                        type: "fill",
                        source: "riyadh",
                        "source-layer": "buildings",
                        paint: {
                            "fill-color": "#E2DAD1",
                            "fill-opacity": 0.9,
                        },
                    },
                    {
                        id: "roads-minor",
                        type: "line",
                        source: "riyadh",
                        "source-layer": "roads",
                        filter: ["in", ["get", "highway"], ["literal", ["residential", "service", "unclassified", "footway", "path", "cycleway"]]],
                        paint: {
                            "line-color": "#FFFFFF",
                            "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.5, 14, 2],
                        },
                    },
                    {
                        id: "roads-secondary",
                        type: "line",
                        source: "riyadh",
                        "source-layer": "roads",
                        filter: ["in", ["get", "highway"], ["literal", ["tertiary", "tertiary_link", "secondary", "secondary_link"]]],
                        paint: {
                            "line-color": "#FFFFFF",
                            "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 14, 4],
                        },
                    },
                    {
                        id: "roads-major",
                        type: "line",
                        source: "riyadh",
                        "source-layer": "roads",
                        filter: ["in", ["get", "highway"], ["literal", ["primary", "primary_link", "trunk", "trunk_link", "motorway", "motorway_link"]]],
                        paint: {
                            "line-color": "#F4C842",
                            "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 13, 6],
                        },
                    },
                ],
            },
            center: [46.6753, 24.7136],
            zoom: 11,
        });

        map.current.addControl(new maplibregl.NavigationControl(), "top-right");

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // update markers when filtered restaurants list changes
    useEffect(() => {
        if (!map.current) return;

        // remove all existing markers
        for (const { marker } of markersRef.current) marker.remove();
        markersRef.current = [];

        // Add a marker for each restaurant in the filtered list
        for (const restaurant of restaurants) {
            const popupHTML = `
                <div style="
                    display:flex; align-items:center; gap:14px; width:300px; padding:14px; border-radius:16px; 
                    background:#ffffff; box-shadow:0 8px 24px rgba(0,0,0,0.15); font-family:Inter, system-ui;
                ">
                    <img
                        src="${restaurant.image}"
                        style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                        alt="${restaurant.name}"
                    />
                    <div style="flex:1;min-width:0;">
                        <h3 style="margin:0;font-size:15px;font-weight:600;color:#1E1E1E;">
                            ${restaurant.name}
                        </h3>
                        <span style="font-size:12px;color:#999;margin-top:4px;display:block;">
                            menu list
                        </span>
                    </div>
                    <button
                        id="map-btn-${restaurant.id}"
                        style="
                            width:38px;height:38px;border-radius:10px;border:none;
                            background:#F2CBDF;display:flex;align-items:center;
                            justify-content:center;cursor:pointer;font-size:16px;flex-shrink:0;
                        "
                    >→</button>
                </div>
            `;

            const popup = new maplibregl.Popup({
                offset: 25,
                closeButton: false,
                maxWidth: "400px"
            }).setHTML(popupHTML);

            const marker = new maplibregl.Marker()
                .setLngLat([restaurant.lng, restaurant.lat])
                .setPopup(popup)
                .addTo(map.current!);

            // button to navigate to this restaurant menu
            popup.on("open", () => {
                const btn = document.getElementById(`map-btn-${restaurant.id}`);
                if (btn) {
                    btn.addEventListener("click", () => {
                        // store the restaurant id so menu page can auto select it
                        sessionStorage.setItem("selectedRestaurantId", String(restaurant.id));
                        window.location.href = "/menu";
                    });
                }
            });

            markersRef.current.push({ marker, id: restaurant.id });
        }
    }, [restaurants]);



    // handle search button click
    const handleSearch = () => {
        setActiveSearch(searchInput);
    };

    return (
        <div className="p-6">

            {/* inject popup CSS override */}
            <style>{popupStyles}</style>

            {/* search + filter Bar */}
            <div className="flex gap-3 mb-4">

                {/* search input, searches restaurant name and menu item names */}
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 flex-1 bg-white dark:bg-[#1E1E1E]">
                    <span className="text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search restaurants or menu items..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 py-2.5 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
                    />
                    {activeSearch && (
                        <button
                            onClick={() => { setSearchInput(""); setActiveSearch(""); }}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* category dropdown, filters pins to only restaurants that serve that category */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#1E1E1E] dark:text-white outline-none"
                >
                    <option value="">All</option>
                    {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-pink-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-400 transition"
                >
                    Search
                </button>
            </div>

            {/* map container */}
            <div
                ref={mapContainer}
                className="w-full rounded-2xl overflow-hidden"
                style={{ height: "calc(100vh - 200px)" }}
            />
        </div>
    );
}
