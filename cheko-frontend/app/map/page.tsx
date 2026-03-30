"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Types
type MenuItem = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    image: string;
    category: string;
};

type Restaurant = {
    lat: number;
    lng: number;
    items: MenuItem[];
};



export default function MapPage() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<MapboxMap | null>(null);
    const markersRef = useRef<{ marker: mapboxgl.Marker; restaurant: Restaurant }[]>([]);

    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Fetch data
    useEffect(() => {
        fetch(`${API_URL}/menu/locations`)
            .then((res) => res.json())
            .then((data) => setMenu(data));
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [46.7, 24.7],
            zoom: 10,
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Group items by unique lat/lng into restaurant locations
    const getRestaurants = (items: MenuItem[]): Restaurant[] => {
        const locationMap = new Map<string, Restaurant>();
        items.forEach((item) => {
            const key = `${item.lat},${item.lng}`;
            if (!locationMap.has(key)) {
                locationMap.set(key, {lat: item.lat, lng: item.lng, items: []});
            }
            locationMap.get(key)!.items.push(item);
        });
        return Array.from(locationMap.values());
    };

    // Add markers when data is ready
    useEffect(() => {
        if (!map.current || menu.length === 0) return;

        // Remove old markers
        markersRef.current.forEach(({marker}) => marker.remove());
        markersRef.current = [];

        const restaurants = getRestaurants(menu);

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
                        src="${window.location.origin}/Cheko_Logo.png"
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

            markersRef.current.push({marker, restaurant});
        });
    }, [menu]);

    // Show / hide markers based on search and category filter
    useEffect(() => {
        markersRef.current.forEach(({marker, restaurant}) => {
            const matchesSearch =
                search === "" ||
                restaurant.items.some((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                );

            const matchesCategory =
                selectedCategory === "All" ||
                restaurant.items.some((item) => item.category === selectedCategory);

            marker.getElement().style.display =
                matchesSearch && matchesCategory ? "" : "none";
        });
    }, [search, selectedCategory]);

    const categories = [
        "All",
        ...Array.from(new Set(menu.map((item) => item.category))).sort(),
    ];

    return (
        <div className="p-6">

            {/* Search + Filter */}
            <div className="flex gap-3 mb-4">
                <div
                    className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 flex-1 bg-white dark:bg-[#1E1E1E]">
                    <span className="text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 py-2.5 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#1E1E1E] dark:text-white outline-none"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-pink-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-400 transition">
                    Search
                </button>
            </div>

            {/* Map */}
            <div
                ref={mapContainer}
                className="w-full rounded-2xl overflow-hidden"
                style={{height: "calc(100vh - 200px)"}}
            />
        </div>
    );
}
