"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// type for each menu item from the backend
type MenuItem = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    image: string;
    category: string;
};

// type for a restaurant location (multiple menu items at same location)
type Restaurant = {
    lat: number;
    lng: number;
    items: MenuItem[];
};

export default function MapPage() {
    const mapContainer = useRef<HTMLDivElement | null>(null);                           // reference to the div that Mapbox will render the map into
    const map = useRef<MapboxMap | null>(null);                                                 // reference to the Mapbox map instance
    const markersRef = useRef<{ marker: mapboxgl.Marker; restaurant: Restaurant }[]>([]);   // reference to all markers on the map, along with their restaurant data

    const [menu, setMenu] = useState<MenuItem[]>([]);                             // all menu items fetched from the backend
    const [search, setSearch] = useState("");                           // what the user type in the search box
    const [selectedCategory, setSelectedCategory] = useState("All");    // which category is selected in the dropdown

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Fetch data
    useEffect(() => {
        fetch(`/api/menu/locations`)
            .then((res) => res.json())
            .then((data) => setMenu(data));
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;   // don't create the map if the div is not ready or map already exists

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [46.7, 24.7],
            zoom: 10,
        });

        return () => {
            map.current?.remove();  // remove the map when the component unmounts
        };
    }, []);

    // Group items by lat/lng to restaurant locations
    const getRestaurants = (items: MenuItem[]): Restaurant[] => {
        const restaurants: Restaurant[] = [];

        for (const item of items) {
            // check if a restaurant already exists at this location
            let found = false;

            for (const restaurant of restaurants) {
                if (restaurant.lat === item.lat && restaurant.lng === item.lng) {
                    //  if location already exists, add this item to it
                    restaurant.items.push(item);
                    found = true;
                    break;
                }
            }

            // if no restaurant found at this location, create a new one
            if (!found) {
                restaurants.push({
                    lat: item.lat,
                    lng: item.lng,
                    items: [item],
                });
            }
        }
        return restaurants;
    };

    // Add markers when data is ready
    useEffect(() => {
        if (!map.current || menu.length === 0) return;

        // Remove old markers
        for (const { marker } of markersRef.current) {
            marker.remove();
        }
        markersRef.current = [];

        // group items into restaurant locations
        const restaurants = getRestaurants(menu);

        // create one marker for each restaurant location
        restaurants.forEach((restaurant) => {

            const popupHTML = `
                <div style="
                    display:flex;
                    align-items:center;
                    gap:14px;
                    width:300px;
                    padding:14px;
                    border-radius:16px;
                    background:#ffffff;
                    box-shadow:0 8px 24px rgba(0,0,0,0.15);
                    font-family:Inter, system-ui;
                ">
                   <img
                        src="/Cheko_Logo.png"
                        style="width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;"
                        alt="Cheko Logo"
                   />
                    <div style="flex:1;min-width:0;">
                        <h3 style="margin:0;font-size:15px;font-weight:600;color:#1E1E1E;">
                            Cheko Restaurant
                        </h3>
                        <span style="font-size:12px;color:#999;margin-top:4px;display:block;">
                            menu list
                        </span>
                    </div>
                    <button
                        id="map-btn-${restaurant.lat}-${restaurant.lng}"
                        style="
                            width:38px;height:38px;border-radius:10px;border:none;
                            background:#F2CBDF;display:flex;align-items:center;
                            justify-content:center;cursor:pointer;font-size:16px;flex-shrink:0;
                        "
                    >→</button>
                </div>
            `;

            // mapbox popup with custom HTML
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
            }).setHTML(popupHTML);

            const marker = new mapboxgl.Marker()
                .setLngLat([restaurant.lng, restaurant.lat])
                .setPopup(popup)
                .addTo(map.current!);

            popup.on("open", () => {
                const btn = document.getElementById(
                    `map-btn-${restaurant.lat}-${restaurant.lng}`
                );
                if (btn) {
                    btn.addEventListener("click", () => {
                        window.location.href = "/menu";
                    });
                }
            });

            // save marker + restaurant data for search and filter
            markersRef.current.push({marker, restaurant});
        });
    }, [menu]); // runs when menu data changes

    // Show or hide markers based on search and category filter
    useEffect(() => {
        for (const { marker, restaurant } of markersRef.current) {

            // check if any item in this restaurant matches the search text
            let matchesSearch = false;
            if (search === "") {
                // no search text → show everything
                matchesSearch = true;
            } else {
                for (const item of restaurant.items) {
                    if (
                        item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.category.toLowerCase().includes(search.toLowerCase())
                    ) {
                        matchesSearch = true;
                        break; // found a match, no need to check more items
                    }
                }
            }

            // check if any item in this restaurant matches the selected category
            let matchesCategory = false;
            if (selectedCategory === "All") {
                // no category filter → show everything
                matchesCategory = true;
            } else {
                for (const item of restaurant.items) {
                    if (item.category === selectedCategory) {
                        matchesCategory = true;
                        break; // found a match, no need to check more items
                    }
                }
            }

            // show marker if both conditions match, hide otherwise
            if (matchesSearch && matchesCategory) {
                marker.getElement().style.display = "";     // show
            } else {
                marker.getElement().style.display = "none"; // hide
            }
        }
    }, [search, selectedCategory]); // runs when search or category changes

    const categories: string[] = ["All"];
    for (const item of menu) {
        if (!categories.includes(item.category)) {
            categories.push(item.category);
        }
    }
    categories.sort();
    // put "All" back at the beginning after sorting
    const sortedCategories = ["All", ...categories.filter((c) => c !== "All")];

    return (
        <div className="p-6">

            {/* search + filter */}
            <div className="flex gap-3 mb-4">

                {/* search input */}
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 flex-1 bg-white dark:bg-[#1E1E1E]">
                    <span className="text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 py-2.5 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
                    />
                </div>

                {/* category dropdown */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#1E1E1E] dark:text-white outline-none"
                >
                    {sortedCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <button className="bg-pink-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-400 transition">
                    Search
                </button>
            </div>

            {/* map container, Mapbox renders the map inside this div */}
            <div
                ref={mapContainer}
                className="w-full rounded-2xl overflow-hidden"
                style={{ height: "calc(100vh - 200px)" }}
            />
        </div>
    );
}

