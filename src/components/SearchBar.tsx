import type { SearchContextType } from "../types/search.types";

function SearchBar({ searchQuery, setSearchQuery }: SearchContextType ) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  }

  return (
    <div className="w-full max-w-sm rounded-xl">
        <input
        name="searchbar"
        type="search"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search company or role"
        className="w-full rounded-xl  backdrop-blur border border-gray-200 px-5 py-2 text-base focus:border-gray-300 focus:outline-none"
        />
    </div>
  )
}

export default SearchBar