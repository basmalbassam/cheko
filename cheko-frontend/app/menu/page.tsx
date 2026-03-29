"use client";

import { useEffect, useRef, useState } from "react";

// Types
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  calorie: number;
  category: string;
};

// Category icon map
const CATEGORY_ICONS: Record<string, string> = {
  Breakfast: "🍳",
  Drinks: "☕",
  Soups: "🍲",
  Sushi: "🍣",
  Rice: "🍚",
  Orders: "📋",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function MenuPage() {
  const [allMenu, setAllMenu] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Fetch data
  useEffect(() => {
    fetch(`${API_URL}/menu`)
        .then((res) => res.json())
        .then((data) => setAllMenu(data));
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Items the user has added to cart (count > 0)
  const orderedItems = allMenu.filter((item) => (counts[item.id] || 0) > 0);
  const totalOrderCount = orderedItems.reduce(
      (sum, item) => sum + (counts[item.id] || 0),
      0
  );

  // Derive real categories dynamically from data
  const dataCategories = Array.from(
      new Set(allMenu.map((item) => item.category))
  ).sort();

  // Tabs: All + real categories + Orders (always last)
  const tabs = ["All", ...dataCategories, "Orders"];

  const categoryCount = (category: string) => {
    if (category === "All") return allMenu.length;
    if (category === "Orders") return totalOrderCount;
    return allMenu.filter((item) => item.category === category).length;
  };

  const isOrdersTab = selectedCategory === "Orders";

  const filteredMenu = (isOrdersTab ? orderedItems : allMenu).filter((item) => {
    const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
        isOrdersTab ||
        selectedCategory === "All" ||
        item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sectionsToShow = isOrdersTab
      ? Array.from(new Set(orderedItems.map((i) => i.category))).sort()
      : selectedCategory === "All"
          ? dataCategories
          : [selectedCategory];

  const groupedMenu = sectionsToShow.reduce((acc, cat) => {
    const items = filteredMenu.filter((item) => item.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const increase = (id: number) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrease = (id: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const isBestSale = (item: MenuItem) => item.calorie > 80;

  const handleFilterSelect = (cat: string) => {
    setSelectedCategory(cat);
    setFilterOpen(false);
  };

  return (
      <div className="p-6 max-w-6xl mx-auto">

        {/* Search + Filter Bar */}
        <div className="flex gap-3 mb-5">
          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl px-4 flex-1 bg-white dark:bg-[#1E1E1E]">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 py-2.5 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
            />
          </div>

          {/* Filter button with dropdown */}
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
              {selectedCategory !== "All" && selectedCategory !== "Orders" && (
                  <span className="bg-pink-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                1
                            </span>
              )}
            </button>

            {filterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-2">
                    <p className="text-xs text-gray-400 px-2 py-1 mb-1">Filter by category</p>

                    {["All", ...dataCategories].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleFilterSelect(cat)}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition ${
                                selectedCategory === cat
                                    ? "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300"
                                    : "hover:bg-gray-100 dark:hover:bg-[#2A2A2A] dark:text-white"
                            }`}
                        >
                                        <span className="flex items-center gap-2">
                                            <span>{CATEGORY_ICONS[cat] ?? "🍽"}</span>
                                            <span>{cat}</span>
                                        </span>
                          <span className="text-xs text-gray-400">
                                            ({categoryCount(cat)})
                                        </span>
                        </button>
                    ))}

                    {selectedCategory !== "All" && selectedCategory !== "Orders" && (
                        <button
                            onClick={() => handleFilterSelect("All")}
                            className="w-full mt-1 px-3 py-2 text-xs text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-left"
                        >
                          ✕ Clear filter
                        </button>
                    )}
                  </div>
                </div>
            )}
          </div>

          <button className="bg-pink-300 text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-400 transition">
            Search
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {tabs.map((cat) => (
              <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      selectedCategory === cat
                          ? "bg-pink-200 dark:bg-pink-900/60 text-black dark:text-white"
                          : "bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]"
                  }`}
              >
                <span>{CATEGORY_ICONS[cat] ?? "🍽"}</span>
                <span>{cat}</span>
                <span className="text-xs opacity-60">({categoryCount(cat)})</span>
              </button>
          ))}
        </div>

        {/* Empty Orders state */}
        {isOrdersTab && orderedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-lg font-medium">Your order is empty</p>
              <p className="text-sm">Add items from the menu to see them here.</p>
            </div>
        )}

        {/* Menu Sections */}
        {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">{category}</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex overflow-hidden cursor-pointer hover:shadow-md transition"
                        onClick={() => setSelectedItem(item)}
                    >
                      {/* Item Image */}
                      <div className="relative w-24 flex-shrink-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                        {isBestSale(item) && (
                            <span className="absolute top-1.5 left-1.5 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            Best Sale
                                        </span>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-semibold text-sm truncate dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.calorie} Cal
                          </p>
                        </div>

                        <div
                            className="flex items-center justify-between mt-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                                        <span className="text-sm font-bold dark:text-white">
                                            {item.price} SAR
                                        </span>

                          <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => decrease(item.id)}
                                className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold leading-none"
                            >
                              −
                            </button>
                            <span className="text-sm w-4 text-center dark:text-white">
                                                {counts[item.id] || 0}
                                            </span>
                            <button
                                onClick={() => increase(item.id)}
                                className="w-6 h-6 flex items-center justify-center bg-pink-200 dark:bg-pink-900/70 rounded text-sm font-bold leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        ))}

        {!isOrdersTab && filteredMenu.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              No items found.
            </div>
        )}

        {/* Detail Popup */}
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
                >
                  ✕
                </button>

                <div className="p-5 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold dark:text-white">
                      {selectedItem.name}
                    </h2>
                    {isBestSale(selectedItem) && (
                        <span className="bg-green-400 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                                        Best Sale
                                    </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mb-3">
                    {selectedItem.calorie} Cal
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-48 object-cover"
                />

                <div className="p-5 flex items-center justify-between">
                            <span className="font-bold text-gray-800 dark:text-white">
                                {selectedItem.price} SAR
                            </span>

                  <div className="flex items-center gap-3">
                    <button
                        onClick={() => decrease(selectedItem.id)}
                        className="w-8 h-8 bg-pink-200 dark:bg-pink-900/70 rounded-lg flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-medium dark:text-white">
                                    {counts[selectedItem.id] || 0}
                                </span>
                    <button
                        onClick={() => increase(selectedItem.id)}
                        className="w-8 h-8 bg-pink-200 dark:bg-pink-900/70 rounded-lg flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
