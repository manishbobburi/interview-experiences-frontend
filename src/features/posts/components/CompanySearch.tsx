import { useState, useEffect } from "react";
import type { Company } from "../post.types";
import { getCompanies } from "../../../services/company.api";
import { getAssetUrl } from "../../../utils/getAssetUrl";

interface CompanySearchProps {
  handleSelect: (company: Company) => void;
}

export default function CompanySearch({ handleSelect }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const filteredCompanies =
    query.length === 0
      ? companies
      : companies.filter((company) =>
          company.name.toLowerCase().startsWith(query.toLowerCase())
        );

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Company"
        value={query}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2"
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isFocused && filteredCompanies.length > 0 && (
        <ul className="absolute w-full bg-white shadow-md rounded mt-1 z-10 max-h-60 overflow-y-auto">
          {filteredCompanies.map((company) => (
            <li
              key={company.id}
              onClick={() => {
                handleSelect(company);
                setQuery(company.name);
                setIsFocused(false);
              }}
              className="flex items-center gap-x-1 p-2 hover:bg-gray-100 cursor-pointer border border-gray-300 rounded m-0.5"
            >
              <div className="w-5 h-5">
                <img src={getAssetUrl(company.logoPath)} alt={company.name} loading="lazy" className="w-full h-full object-contain"/>
              </div>
              {company.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}