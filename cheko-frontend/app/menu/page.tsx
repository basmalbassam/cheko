"use client";

import { useEffect, useRef, useState } from "react";


// types
type RestaurantType = {
  id: number;
  name: string;
  image: string;
  lat: number;
  lng: number;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  calorie: number;
  category: string;
};

type PagedMenu = {
  content: MenuItem[];
  totalPages: number;
  totalElements: number;
  number: number;
};

// constants
const CategoryIcons: Record<string, string> = {
  Breakfast: "🍳",
  Drinks: "☕",
  Soups: "🍲",
  Sushi: "🍣",
  Rice: "🍚",
};

const PAGE_SIZE = 9; // number of items per page



export default function MenuPage() {

  // restaurant state
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);                                // list of all restaurants fetched from backend
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantType | null>(null); // the one the user clicked, if null shows the selection screen

  // menu state
  const [pagedMenu, setPagedMenu] = useState<PagedMenu | null>(null);   // the current page of menu items from backend
  const [restaurantCategories, setRestaurantCategories] = useState<string[]>([]); // categories this restaurant has
  const [totalItems, setTotalItems] = useState(0);                      // fixed total: fetched once, never changes when user filters

  // search and filter state
  const [searchInput, setSearchInput] = useState("");                          // what the user is typing
  const [activeSearch, setActiveSearch] = useState("");                        // what was submitted
  const [selectedCategory, setSelectedCategory] = useState("");                // the active category filter
  const [filterOpen, setFilterOpen] = useState(false);                         // whether the filter dropdown is open or closed
  const filterRef = useRef<HTMLDivElement>(null); // reference to the filter dropdown to detect clicks outside it

  // pagination state
  const [currentPage, setCurrentPage] = useState(0); // current page index

  // cart state
  const [counts, setCounts] = useState<Record<number, number>>({});                  // if { 1: 3, 5: 1 } means item 1 has count 3, item 5 has count 1
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); // item the user clicked to see its popup, if null means no popup
  const [itemDetails, setItemDetails] = useState<Record<number, MenuItem>>({});      // stores all menu items across all pages

  // active chip tab
  const [activeChip, setActiveChip] = useState("All"); // which chip tab is currently selected (All / category / Orders)



  // resets everything to a clean state when user picks a restaurant.
  const handleSelectRestaurant = (restaurant: RestaurantType) => {
    setSelectedRestaurant(restaurant);
    setPagedMenu(null);
    setTotalItems(0);
    setSearchInput("");
    setActiveSearch("");
    setSelectedCategory("");
    setCurrentPage(0);
    setCounts({});
    setItemDetails({});
    setActiveChip("All");

    // fetch categories this restaurant has (for filter dropdown)
    fetch(`/api/menu/categories?restaurantId=${restaurant.id}`)
        .then((res) => res.json())
        .then((data) => setRestaurantCategories(data));

    // fetch fixed total count (no filters)  for All chip count
    fetch(`/api/menu?restaurantId=${restaurant.id}&page=0&size=1`)
        .then((res) => res.json())
        .then((data) => setTotalItems(data.totalElements));
  };

  // fetch all restaurants to show the selection screen
  useEffect(() => {
    fetch("/api/restaurants")
        .then((res) => res.json())
        .then((data) => setRestaurants(data));
  }, []);

  // auto select restaurant if navigated from map
  useEffect(() => {
    if (restaurants.length === 0) return;
    const storedId = sessionStorage.getItem("selectedRestaurantId");
    if (storedId) {
      const id = parseInt(storedId);
      const restaurant = restaurants.find((r) => r.id === id);
      if (restaurant) {
        sessionStorage.removeItem("selectedRestaurantId");
        handleSelectRestaurant(restaurant);
      }
    }
  }, [restaurants]);

  // fetch paginated menu from backend, when restaurant, search, category, or page changes
  useEffect(() => {
    if (!selectedRestaurant) return;

    // build query params for the backend
    const params = new URLSearchParams();
    params.set("restaurantId", String(selectedRestaurant.id));
    params.set("page", String(currentPage));
    params.set("size", String(PAGE_SIZE));
    if (activeSearch) params.set("search", activeSearch);
    if (selectedCategory) params.set("category", selectedCategory);

    fetch(`/api/menu?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setPagedMenu(data);
          // accumulate all fetched items so Orders tab works across pages
          setItemDetails((prev) => {
            const updated = { ...prev };
            for (const item of data.content) {
              updated[item.id] = item;
            }
            return updated;
          });
        });

  }, [selectedRestaurant, activeSearch, selectedCategory, currentPage]);

  // close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // removes the event listener when unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // counter functions
  const increase = (id: number) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrease = (id: number) => {
    const current = counts[id] || 0;
    if (current > 0) {
      setCounts((prev) => ({ ...prev, [id]: current - 1 }));
    }
  };


  // best sale, cheapest item per category
  const cheapestPerCategory: Record<string, number> = {};
  for (const item of Object.values(itemDetails)) {
    if (
        cheapestPerCategory[item.category] === undefined ||
        item.price < cheapestPerCategory[item.category]
    ) {
      cheapestPerCategory[item.category] = item.price;
    }
  }
  const isBestSale = (item: MenuItem) => item.price === cheapestPerCategory[item.category];


  // group current page items by category for display
  const allItems = pagedMenu?.content || [];
  const groupedMenu: Record<string, MenuItem[]> = {};
  for (const item of allItems) {
    if (!groupedMenu[item.category]) {
      groupedMenu[item.category] = [];
    }
    groupedMenu[item.category].push(item);
  }


  // orders cart, all items with count > 0 (across all pages)
  const orderedItems: MenuItem[] = [];
  for (const [idStr, item] of Object.entries(itemDetails)) {
    if ((counts[Number(idStr)] || 0) > 0) orderedItems.push(item);
  }
  let totalOrderCount = 0;
  for (const item of orderedItems) totalOrderCount += counts[item.id] || 0;


  // chip tabs (All + categories + Orders)
  const chipTabs = ["All", ...restaurantCategories, "Orders"];

  // handle chip click
  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip === "All") {
      handleFilterSelect("");
    } else if (chip === "Orders") { // just switches the view without a backend call
    } else {
      handleFilterSelect(chip);
    }
  };


  // handlers, reset to page 0 so start from the first page after a new search or filter.
  const handleSearch = () => {
    setActiveSearch(searchInput);
    setCurrentPage(0); // always go back to page 1 on new search
  };

  const handleFilterSelect = (cat: string) => {
    setSelectedCategory(cat);
    setFilterOpen(false);
    setCurrentPage(0); // always go back to page 1 on filter change
  };



  // restaurant selection screen
  if (!selectedRestaurant) {
    return (
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 dark:text-white">Choose a Restaurant</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Select a branch to browse its menu
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
                <div
                    key={restaurant.id}
                    onClick={() => handleSelectRestaurant(restaurant)}
                    className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-pink-200 dark:hover:border-pink-800 transition"
                >
                  <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold dark:text-white">{restaurant.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {restaurant.lat.toFixed(4)}, {restaurant.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>
    );
  }


  // menu screen
  return (
      <div className="p-6 max-w-6xl mx-auto">

        {/* back button + restaurant name */}
        <div className="flex items-center gap-3 mb-6">
          <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink-500 transition"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-8 h-8 rounded-full object-cover"
            />
            <h1 className="text-lg font-semibold dark:text-white">{selectedRestaurant.name}</h1>
          </div>
        </div>

        {/* search + filter bar */}
        <div className="flex gap-3 mb-5">

          {/* search input */}
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 flex-1 bg-white dark:bg-[#1E1E1E]">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 py-2.5 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
            />
            {activeSearch && (
                <button
                    onClick={() => { setActiveSearch(""); setSearchInput(""); setCurrentPage(0); }}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
            )}
          </div>

          {/* filter dropdown */}
          <div className="relative" ref={filterRef}>
            <button
                onClick={() => setFilterOpen((prev) => !prev)}
                className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm transition ${
                    filterOpen
                        ? "bg-pink-200 dark:bg-pink-900/60 border-pink-300 dark:border-pink-700"
                        : "bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]"
                } dark:text-white`}
            >
              <span className="text-gray-400">≡</span>
              <span>Filter</span>
              {selectedCategory && (
                  <span className="bg-pink-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
              )}
            </button>

            {filterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-2 py-1 mb-1">Filter by category</p>

                    {/* All option */}
                    <button
                        onClick={() => handleFilterSelect("")}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                            selectedCategory === ""
                                ? "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                                : "hover:bg-gray-100 dark:hover:bg-[#2A2A2A] dark:text-white"
                        }`}
                    >
                      <span>🍽</span>
                      <span>All</span>
                    </button>

                    {/* only categories this restaurant has */}
                    {restaurantCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleFilterSelect(cat)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                                selectedCategory === cat
                                    ? "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                                    : "hover:bg-gray-100 dark:hover:bg-[#2A2A2A] dark:text-white"
                            }`}
                        >
                          <span>{CategoryIcons[cat] ?? "🍽"}</span>
                          <span>{cat}</span>
                        </button>
                    ))}

                    {selectedCategory && (
                        <button
                            onClick={() => handleFilterSelect("")}
                            className="w-full mt-1 px-3 py-2 text-xs text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-left"
                        >
                          ✕ Clear filter
                        </button>
                    )}
                  </div>
                </div>
            )}
          </div>

          {/* search button triggers backend search */}
          <button
              onClick={handleSearch}
              className="bg-pink-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-400 transition"
          >
            Search
          </button>
        </div>

        {/* category chips + Orders tab */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {chipTabs.map((chip) => (
              <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      activeChip === chip
                          ? "bg-pink-200 dark:bg-pink-900/60 text-black dark:text-white"
                          : "bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]"
                  }`}
              >
                <span>{chip === "Orders" ? "📋" : (CategoryIcons[chip] ?? "🍽")}</span>
                <span>{chip}</span>
                {/* FIX: All uses fixed totalItems (never changes), Orders shows cart count, categories show nothing */}
                {chip === "All" && <span className="text-xs opacity-60">({totalItems})</span>}
                {chip === "Orders" && <span className="text-xs opacity-60">({totalOrderCount})</span>}
              </button>
          ))}
        </div>

        {/* Orders empty state */}
        {activeChip === "Orders" && totalOrderCount === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-lg font-medium">Your order is empty</p>
              <p className="text-sm">Add items from the menu to see them here.</p>
            </div>
        )}

        {/* active indicators */}
        {(activeSearch || selectedCategory) && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {activeSearch && (
                  <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-xs px-3 py-1 rounded-full">
                    Search: &quot;{activeSearch}&quot;
                  </span>
              )}
              {selectedCategory && (
                  <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-xs px-3 py-1 rounded-full">
                    {CategoryIcons[selectedCategory]} {selectedCategory}
                  </span>
              )}
              <span className="text-xs text-gray-400 self-center">
                {pagedMenu?.totalElements ?? 0} results
              </span>
            </div>
        )}

        {/* no results */}
        {activeChip !== "Orders" && pagedMenu && pagedMenu.content.length === 0 && (
            <div className="text-center py-24 text-gray-400">No items found.</div>
        )}

        {/* Orders view, only shows when Orders chip is active */}
        {activeChip === "Orders" && orderedItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">🛒 Your Order</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orderedItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex overflow-hidden cursor-pointer hover:shadow-md transition"
                        onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative w-24 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-semibold text-sm truncate dark:text-white">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{item.calorie} Cal</p>
                        </div>
                        <div className="flex items-center justify-between mt-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-sm font-bold dark:text-white">{item.price} SAR</span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => decrease(item.id)} className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold">−</button>
                            <span className="text-sm w-4 text-center dark:text-white">{counts[item.id] || 0}</span>
                            <button onClick={() => increase(item.id)} className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* menu sections, hidden when Orders tab is active */}
        {activeChip !== "Orders" && Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                {CategoryIcons[category] ?? "🍽"} {category}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex overflow-hidden cursor-pointer hover:shadow-md transition"
                        onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative w-24 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        {isBestSale(item) && (
                            <span className="absolute top-1.5 left-1.5 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Best Sale
                            </span>
                        )}
                      </div>

                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-semibold text-sm truncate dark:text-white">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{item.calorie} Cal</p>
                        </div>
                        <div
                            className="flex items-center justify-between mt-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-sm font-bold dark:text-white">{item.price} SAR</span>
                          <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => decrease(item.id)}
                                className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold"
                            >−</button>
                            <span className="text-sm w-4 text-center dark:text-white">
                              {counts[item.id] || 0}
                            </span>
                            <button
                                onClick={() => increase(item.id)}
                                className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold"
                            >+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        ))}

        {/* pagination, hidden when Orders tab is active */}
        {activeChip !== "Orders" && pagedMenu && pagedMenu.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">

              {/* previous button */}
              <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] dark:text-white transition"
              >
                ← Prev
              </button>

              {/* page number buttons */}
              {Array.from({ length: pagedMenu.totalPages }, (_, i) => (
                  <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-9 h-9 rounded-xl text-sm transition ${
                          currentPage === i
                              ? "bg-pink-300 text-black font-bold"
                              : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] dark:text-white"
                      }`}
                  >
                    {i + 1}
                  </button>
              ))}

              {/* next button */}
              <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === pagedMenu.totalPages - 1}
                  className="px-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] dark:text-white transition"
              >
                Next →
              </button>
            </div>
        )}

        {/* detail popup */}
        {selectedItem && (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedItem(null)}
            >
              <div
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-sm relative overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
              >
                <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-3 right-3 z-10 w-7 h-7 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#444] transition"
                >✕</button>

                <div className="p-5 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold dark:text-white">{selectedItem.name}</h2>
                    {isBestSale(selectedItem) && (
                        <span className="bg-green-400 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                          Best Sale
                        </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{selectedItem.calorie} Cal</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover" />

                <div className="p-5 flex items-center justify-between">
                  <span className="font-bold text-gray-800 dark:text-white">{selectedItem.price} SAR</span>
                  <div className="flex items-center gap-3">
                    <button
                        onClick={() => decrease(selectedItem.id)}
                        className="w-8 h-8 bg-pink-200 dark:bg-pink-900/70 rounded-lg flex items-center justify-center font-bold"
                    >−</button>
                    <span className="w-5 text-center font-medium dark:text-white">
                      {counts[selectedItem.id] || 0}
                    </span>
                    <button
                        onClick={() => increase(selectedItem.id)}
                        className="w-8 h-8 bg-pink-200 dark:bg-pink-900/70 rounded-lg flex items-center justify-center font-bold"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}