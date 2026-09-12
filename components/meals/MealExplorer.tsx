"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { Meal } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import MealCard from "./MealCard";

export default function MealExplorer() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      fetch(
        `/api/meals?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&sort=${sort}&page=${page}`,
      )
        .then(async (response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((data) => {
          setMeals(data.meals);
          setCategories(data.categories);
          setPages(data.pages);
          if (search) trackEvent("search_used", { queryLength: search.length });
        })
        .catch(() => setError("The menu could not be loaded right now."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort, page]);

  return (
    <section id="menu" className="shell">
      <div className="toolbar">
        <label className="input search">
          <Search
            size={17}
            style={{ verticalAlign: "middle", marginRight: 8 }}
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") setPage(1);
            }}
            placeholder="Search the menu"
            aria-label="Search the menu"
            style={{
              border: 0,
              outline: 0,
              background: "transparent",
              color: "inherit",
              width: "calc(100% - 30px)",
            }}
          />
        </label>
        <select
          className="select"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setPage(1);
          }}
          aria-label="Sort menu"
        >
          <option value="">Sort: featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </select>
        <div className="chips">
          <button
            className={`chip ${!category ? "active" : ""}`}
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              className={`chip ${category === item ? "active" : ""}`}
              key={item}
              onClick={() => {
                setCategory(item);
                setPage(1);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="card skeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="notice">
          <p>{error}</p>
          <button className="button" onClick={() => setPage(page)}>
            Retry
          </button>
        </div>
      ) : meals.length === 0 ? (
        <div className="notice">
          <h3>Nothing matched that craving.</h3>
          <p>Try a broader search or clear the category filter.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {meals.map((meal, index) => (
              <MealCard
                meal={meal}
                priority={page === 1 && index < 4}
                key={meal.id}
              />
            ))}
          </div>
          <div className="toolbar" style={{ justifyContent: "center" }}>
            <button
              className="button secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="muted">
              Page {page} of {pages}
            </span>
            <button
              className="button secondary"
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
