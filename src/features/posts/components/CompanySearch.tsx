import { useState, useEffect, useRef } from "react";
import type { Company } from "../post.types";
import { getCompanies } from "../../../services/company.api";
import { getAssetUrl } from "../../../utils/getAssetUrl";

interface CompanySearchProps {
  handleSelect: (company: Company) => void;
}

export default function CompanySearch({ handleSelect }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      const response = await getCompanies();
      if (response.success) {
        setCompanies(response.data);
      } else {
        setError("Failed to load company details");
      }
      setLoading(false);
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        if (selectedCompany) setQuery(selectedCompany.name);
        else setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCompany]);

  const filteredCompanies =
    query.length === 0
      ? companies
      : companies.filter((company) =>
          company.name.toLowerCase().startsWith(query.toLowerCase())
        );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedCompany) setSelectedCompany(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center w-full border border-gray-200 rounded-xl px-3 py-2.5 gap-2 focus-within:ring-2transition bg-white">
        {selectedCompany && (
          <img
            src={getAssetUrl(selectedCompany.logoPath)}
            alt={selectedCompany.name}
            className="w-5 h-5 object-contain shrink-0"
          />
        )}
        <input
          type="text"
          placeholder="Search company…"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={handleInputChange}
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {loading && (
        <p className="text-xs text-gray-400 mt-1 px-1">Loading companies…</p>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1 px-1">{error}</p>
      )}

      {isFocused && filteredCompanies.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-100 shadow-lg rounded-xl mt-1.5 z-50 max-h-60 overflow-y-auto py-1">
          {filteredCompanies.map((company) => (
            <li
              key={company.id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(company);
                setSelectedCompany(company);
                setQuery(company.name);
                setIsFocused(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 mx-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="w-5 h-5 shrink-0">
                <img
                  src={getAssetUrl(company.logoPath)}
                  alt={company.name}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm text-gray-700">{company.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
