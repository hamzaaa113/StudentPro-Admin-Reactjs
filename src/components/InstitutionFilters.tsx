import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Plus, Upload, Download, Filter, X } from "lucide-react";
import {
  INSTITUTION_SECTORS,
  FILTER_COUNTRIES,
  FILTER_TERRITORIES,
  FILTER_GROUPS,
  FILTER_YES_NO,
  PAGE_SIZE_OPTIONS,
  COUNTRY_STATES,
} from "../utils/helpers";

interface InstitutionFiltersProps {
  searchName: string;
  filterCountry: string;
  filterState: string;
  filterTerritory: string;
  filterSector: string;
  filterGroup: string;
  filterPromoted: string;
  filter100Promotion: string;
  filterScholarship: string;
  pageSize: number;
  importing: boolean;
  exporting: boolean;
  hasActiveFilters: boolean;
  onSearchNameChange: (value: string) => void;
  onFilterCountryChange: (value: string) => void;
  onFilterStateChange: (value: string) => void;
  onFilterTerritoryChange: (value: string) => void;
  onFilterSectorChange: (value: string) => void;
  onFilterGroupChange: (value: string) => void;
  onFilterPromotedChange: (value: string) => void;
  onFilter100PromotionChange: (value: string) => void;
  onFilterScholarshipChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onClearFilters: () => void;
  onImport: () => void;
  onExport: () => void;
  onAddInstitution: () => void;
}

export default function InstitutionFilters(props: InstitutionFiltersProps) {
  const {
    searchName,
    filterCountry,
    filterState,
    filterTerritory,
    filterSector,
    filterGroup,
    filter100Promotion,
    filterScholarship,
    pageSize,
    importing,
    exporting,
    hasActiveFilters,
    onSearchNameChange,
    onFilterCountryChange,
    onFilterStateChange,
    onFilterTerritoryChange,
    onFilterSectorChange,
    onFilterGroupChange,
    onFilter100PromotionChange,
    onFilterScholarshipChange,
    onPageSizeChange,
    onClearFilters,
    onImport,
    onExport,
    onAddInstitution,
  } = props;

  // Toggle filter visibility
  const [showFilters, setShowFilters] = useState(true);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col items-stretch flex-1 gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => onSearchNameChange(e.target.value)}
              className="h-9 w-full sm:max-w-[240px] text-sm"
            />
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`flex h-9 shrink-0 items-center justify-center gap-1.5 px-3 text-white text-xs 
    bg-[#0A1F38] 
    border border-white/30 
    transition-all duration-200 
    hover:bg-[#0C2A4D] hover:text-white
    active:bg-[#091A2C]
  `}
            >
              {showFilters ? <X size={14} /> : <Filter size={14} />}
              Filters
            </Button>

          </div>

          <div className="flex flex-wrap gap-1.5">
            <Button
              onClick={onImport}
              variant="outline"
              className="flex flex-1 sm:flex-none h-8 items-center justify-center gap-1.5 px-3 text-xs"
              disabled={importing}
            >
              <Upload size={14} />
              <span className="hidden sm:inline">{importing ? "Importing..." : "Import"}</span>
              <span className="sm:hidden">{importing ? "..." : "Import"}</span>
            </Button>

            <Button
              onClick={onExport}
              className="flex flex-1 sm:flex-none h-8 items-center justify-center gap-1.5 px-3 text-xs text-[#0A1F38]
  bg-[#ABDBC0] 
  rounded-md 
hover:bg-[#ABDBC0]"

              disabled={exporting}
            >
              <Download size={14} />
              <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export"}</span>
              <span className="sm:hidden">{exporting ? "..." : "Export"}</span>
            </Button>

            <Button
              onClick={onAddInstitution}
              className="flex flex-1 sm:flex-none h-8 items-center justify-center gap-1.5 bg-[#0A1F38] px-3 text-xs text-white hover:bg-[#0C2A4D]"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Institution</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* SHOW FILTERS ONLY WHEN OPEN */}
      {showFilters && (
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterCountry}
              onChange={(e) => onFilterCountryChange(e.target.value)}
            >
              <option value="">All Countries</option>
              {FILTER_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            {/* State Filter - Only show when country is selected */}
            {filterCountry && COUNTRY_STATES[filterCountry] && (
              <select
                className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
                value={filterState}
                onChange={(e) => onFilterStateChange(e.target.value)}
              >
                <option value="">All States</option>
                {COUNTRY_STATES[filterCountry].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterTerritory}
              onChange={(e) => onFilterTerritoryChange(e.target.value)}
            >
              <option value="">All Territories</option>
              {FILTER_TERRITORIES.map((territory) => (
                <option key={territory} value={territory}>
                  {territory}
                </option>
              ))}
            </select>

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterSector}
              onChange={(e) => onFilterSectorChange(e.target.value)}
            >
              <option value="">All Sectors</option>
              {INSTITUTION_SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterGroup}
              onChange={(e) => onFilterGroupChange(e.target.value)}
            >
              <option value="">All Groups</option>
              {FILTER_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            {/* <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterPromoted}
              onChange={(e) => onFilterPromotedChange(e.target.value)}
            >
              <option value="">Promoted: All</option>
              {FILTER_PROMOTIONS.map((promotion) => (
                <option key={promotion} value={promotion}>
                  {promotion}
                </option>
              ))}
            </select> */}

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filter100Promotion}
              onChange={(e) => onFilter100PromotionChange(e.target.value)}
            >
              <option value="">100% Promotion: All</option>
              {FILTER_YES_NO.map((option) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={filterScholarship}
              onChange={(e) => onFilterScholarshipChange(e.target.value)}
            >
              <option value="">Scholarship: All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <select
              className="h-9 w-full rounded-lg border px-3 py-1.5 text-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                onClick={onClearFilters}
                className="h-9 w-full bg-[#0A1F38] px-4 text-xs text-white hover:bg-[#0C2A4D] sm:col-span-2 lg:col-span-1"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
