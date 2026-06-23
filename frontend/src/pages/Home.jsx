import { useState, useEffect } from "react";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["electronics", "audio", "wearables", "fashion"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await getProducts({
          category: category || undefined,
          search: search || undefined,
          page,
          size: 12,
        });
        if (!isCancelled) {
          setProducts(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [category, search, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  const handleCategoryClick = (cat) => {
    setPage(0);
    setCategory(cat === category ? "" : cat); // click again to clear filter
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 20, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ flex: 1, padding: 10, fontSize: 14 }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Search
        </button>
      </form>

      {/* Category filter chips */}
      <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 16,
              border: "1px solid #ccc",
              backgroundColor: category === cat ? "#131921" : "white",
              color: category === cat ? "white" : "black",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content states */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found. Try a different search or category.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center" }}>
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span style={{ padding: "0 8px" }}>
                Page {page + 1} of {totalPages}
              </span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}