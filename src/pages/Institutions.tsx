import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useInstitutions } from "../hooks/useInstitution";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import type {
  Institution,
  CreateInstitutionData,
  UpdateInstitutionData,
  XLSXImportResponse,
  InstitutionFilters as InstitutionFiltersType,
  XLSXExportFilters,
} from "../types/institution.types";
import {
  X,
  GraduationCap,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  validateExcelFile,
  formatFileSize,
  resetFileInput,
  getPaginationRange,
  shouldShowStartEllipsis,
  shouldShowEndEllipsis,
  buildInstitutionFilters,
  buildExportFilters,
} from "../utils/helpers";

import InstitutionModal from "../components/InstitutionModal";
import InstitutionFilters from "../components/InstitutionFilters";
import InstitutionsTable from "../components/InstitutionsTable";
import InstitutionViewModal from "../components/InstitutionViewModal";

export default function Institutions() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states - must be defined before useInstitutions
  const [searchName, setSearchName] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterTerritory, setFilterTerritory] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterPromoted, setFilterPromoted] = useState("");
  const [filter100Promotion, setFilter100Promotion] = useState("");
  const [filterScholarship, setFilterScholarship] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Debounce timer ref for live search
  const searchTimeoutRef = useRef<number | null>(null);

  const {
    institutions,
    loading,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    exportToXLSX,
    importFromXLSX,
    importing,
    exporting,
  } = useInstitutions({ page: 1, pageSize });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportResultModal, setShowImportResultModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [importResult, setImportResult] = useState<XLSXImportResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL query parameters for country filter
  useEffect(() => {
    const countryParam = searchParams.get('country');
    if (countryParam && countryParam !== filterCountry) {
      // Use a functional state update to avoid cascading renders
      const applyCountryFilter = () => {
        setFilterCountry(countryParam);
        setFilterState("");
        setHasActiveFilters(true);
        
        // Clear the query parameter after setting the filter
        setSearchParams({});
        
        // Apply the filter
        const cleanFilters = buildInstitutionFilters({
          searchName,
          filterCountry: countryParam,
          filterState: "",
          filterTerritory,
          filterSector,
          filterGroup,
          filterPromoted,
          filterScholarship,
          filter100Promotion,
          pageSize,
        });
        updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      };
      
      applyCountryFilter();
    }
  }, [searchParams, filterCountry, searchName, filterTerritory, filterSector, filterGroup, filterPromoted, filterScholarship, filter100Promotion, pageSize, setSearchParams, updateFilters]);

  // Handle filter application
  const handleApplyFilters = (overridePageSize?: number | unknown) => {
    const currentSize = typeof overridePageSize === 'number' ? overridePageSize : pageSize;
    const cleanFilters = buildInstitutionFilters({
      searchName,
      filterCountry,
      filterState,
      filterTerritory,
      filterSector,
      filterGroup,
      filterPromoted,
      filterScholarship,
      filter100Promotion,
      pageSize: currentSize,
    });

    updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
    setHasActiveFilters(true);
  };

  // Handle live search as user types
  const handleSearchNameChange = (value: string) => {
    setSearchName(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = window.setTimeout(() => {
      handleApplyFilters();
    }, 300); // 300ms debounce
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchName("");
    setFilterCountry("");
    setFilterState("");
    setFilterTerritory("");
    setFilterSector("");
    setFilterGroup("");
    setFilterPromoted("");
    setFilter100Promotion("");
    setFilterScholarship("");
    setPageSize(15);

    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    clearFilters();
    setHasActiveFilters(false);
  };

  // Handle country change - clear state when country changes and auto-apply immediately
  const handleFilterCountryChange = (value: string) => {
    setFilterCountry(value);
    // Clear state filter when country changes
    if (value !== filterCountry) {
      setFilterState("");
    }
    // Auto-apply filters immediately
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry: value,
        filterState: "", // Reset state when country changes
        filterTerritory,
        filterSector,
        filterGroup,
        filterPromoted,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || value || filterTerritory || filterSector || filterGroup || filterPromoted || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle state change and auto-apply
  const handleFilterStateChange = (value: string) => {
    setFilterState(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState: value,
        filterTerritory,
        filterSector,
        filterGroup,
        filterPromoted,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || value || filterTerritory || filterSector || filterGroup || filterPromoted || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle territory change and auto-apply
  const handleFilterTerritoryChange = (value: string) => {
    setFilterTerritory(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory: value,
        filterSector,
        filterGroup,
        filterPromoted,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || value || filterSector || filterGroup || filterPromoted || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle sector change and auto-apply
  const handleFilterSectorChange = (value: string) => {
    setFilterSector(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory,
        filterSector: value,
        filterGroup,
        filterPromoted,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || filterTerritory || value || filterGroup || filterPromoted || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle group change and auto-apply
  const handleFilterGroupChange = (value: string) => {
    setFilterGroup(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory,
        filterSector,
        filterGroup: value,
        filterPromoted,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || filterTerritory || filterSector || value || filterPromoted || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle promoted change and auto-apply
  const handleFilterPromotedChange = (value: string) => {
    setFilterPromoted(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory,
        filterSector,
        filterGroup,
        filterPromoted: value,
        filterScholarship,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || filterTerritory || filterSector || filterGroup || value || filterScholarship || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle 100% promotion change and auto-apply
  const handleFilter100PromotionChange = (value: string) => {
    setFilter100Promotion(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory,
        filterSector,
        filterGroup,
        filterPromoted,
        filterScholarship,
        filter100Promotion: value,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || filterTerritory || filterSector || filterGroup || filterPromoted || filterScholarship || value);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle scholarship change and auto-apply
  const handleFilterScholarshipChange = (value: string) => {
    setFilterScholarship(value);
    setTimeout(() => {
      const cleanFilters = buildInstitutionFilters({
        searchName,
        filterCountry,
        filterState,
        filterTerritory,
        filterSector,
        filterGroup,
        filterPromoted,
        filterScholarship: value,
        filter100Promotion,
        pageSize,
      });
      updateFilters(cleanFilters as Partial<InstitutionFiltersType>);
      // Check if any filters are actually active
      const hasFilters = !!(searchName || filterCountry || filterState || filterTerritory || filterSector || filterGroup || filterPromoted || value || filter100Promotion);
      setHasActiveFilters(hasFilters);
    }, 0);
  };

  // Handle page size change with auto-apply
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Automatically apply filters when page size changes
    handleApplyFilters(newSize);
  };

  // Handle create institution
  const handleCreateInstitution = async (data: CreateInstitutionData) => {
    const success = await createInstitution(data);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  // Handle update institution
  const handleUpdateInstitution = async (data: UpdateInstitutionData) => {
    if (!selectedInstitution) return false;
    const success = await updateInstitution(selectedInstitution._id, data);
    if (success) {
      setShowEditModal(false);
      setSelectedInstitution(null);
    }
    return success;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this institution?")) {
      await deleteInstitution(id);
    }
  };

  // Open edit modal
  const openEditModal = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowViewModal(true);
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const validation = validateExcelFile(file);

    if (!validation.isValid) {
      toast.error(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file!);
  };

  // Handle import
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    // Simulate progress while importing
    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 85) return prev; // Stop at 85% to wait for actual completion
        return prev + 10;
      });
    }, 300);

    try {
      // Wait for import to complete
      const result = await importFromXLSX(selectedFile);

      // Clear the interval
      clearInterval(progressInterval);

      if (result) {
        // Set progress to 100%
        setImportProgress(100);

        // Wait a bit to show 100% completion before closing
        setTimeout(() => {
          setImportResult(result);
          setShowImportModal(false);
          setShowImportResultModal(true);
          setSelectedFile(null);
          setIsImporting(false);
          setImportProgress(0);
          resetFileInput(fileInputRef);
        }, 800);
      } else {
        // Import failed
        clearInterval(progressInterval);
        setIsImporting(false);
        setImportProgress(0);
        toast.error("Failed to import file. Please try again.");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setIsImporting(false);
      setImportProgress(0);
      const errorMessage = error instanceof Error ? error.message : "Failed to import file";
      toast.error(errorMessage);
    }
  };

  // Handle export with current filters
  const handleExportFiltered = async () => {
    const cleanFilters = buildExportFilters({
      searchName,
      filterCountry,
      filterState,
      filterTerritory,
      filterSector,
      filterGroup,
      filterPromoted,
      filterScholarship,
    });

    await exportToXLSX(cleanFilters as Partial<XLSXExportFilters>);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Institutions</h1>
        <p className="mt-1 text-gray-600">Manage educational institutions</p>
      </div> */}

      {/* Filters Card */}
      <InstitutionFilters
        searchName={searchName}
        filterCountry={filterCountry}
        filterState={filterState}
        filterTerritory={filterTerritory}
        filterSector={filterSector}
        filterGroup={filterGroup}
        filterPromoted={filterPromoted}
        filter100Promotion={filter100Promotion}
        filterScholarship={filterScholarship}
        pageSize={pageSize}
        importing={importing}
        exporting={exporting}
        hasActiveFilters={hasActiveFilters}
        onSearchNameChange={handleSearchNameChange}
        onFilterCountryChange={handleFilterCountryChange}
        onFilterStateChange={handleFilterStateChange}
        onFilterTerritoryChange={handleFilterTerritoryChange}
        onFilterSectorChange={handleFilterSectorChange}
        onFilterGroupChange={handleFilterGroupChange}
        onFilterPromotedChange={handleFilterPromotedChange}
        onFilter100PromotionChange={handleFilter100PromotionChange}
        onFilterScholarshipChange={handleFilterScholarshipChange}
        onPageSizeChange={handlePageSizeChange}
        onClearFilters={handleClearFilters}
        onImport={() => setShowImportModal(true)}
        onExport={handleExportFiltered}
        onAddInstitution={() => setShowCreateModal(true)}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1}-{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} institutions
        </span>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : institutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <GraduationCap size={48} className="mb-4 text-gray-400" />
              <p className="text-lg font-medium">No institutions found</p>
              <p className="text-sm">Try adjusting your filters or create a new institution</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <InstitutionsTable
                institutions={institutions}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onView={openViewModal}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page <span className="font-medium">{pagination.page}</span> of{" "}
            <span className="font-medium">{pagination.totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              variant="outline"
              size="sm"
              className="h-9"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            {/* First Page */}
            {shouldShowStartEllipsis(pagination.page) && (
              <>
                <Button
                  onClick={() => changePage(1)}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9"
                >
                  1
                </Button>
                {pagination.page > 4 && <span className="px-2 text-teal-600">...</span>}
              </>
            )}

            {/* Page Numbers */}
            {getPaginationRange(pagination.page, pagination.totalPages).map((page) => (
              <Button
                key={page}
                onClick={() => changePage(page)}
                variant={page === pagination.page ? "default" : "outline"}
                size="sm"
                className={`h-9 w-9 ${page === pagination.page ? 'bg-[#0A1F38] hover:bg-[#0A1F38] text-white' : ''}`}
              >
                {page}
              </Button>
            ))}

            {/* Last Page */}
            {shouldShowEndEllipsis(pagination.page, pagination.totalPages) && (
              <>
                {pagination.page < pagination.totalPages - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  onClick={() => changePage(pagination.totalPages)}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9"
                >
                  {pagination.totalPages}
                </Button>
              </>
            )}

            <Button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              variant="outline"
              size="sm"
              className="h-9"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <InstitutionModal
        isOpen={showCreateModal || showEditModal}
        mode={showCreateModal ? "create" : "edit"}
        institution={selectedInstitution}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedInstitution(null);
        }}
        onSubmit={showCreateModal ? handleCreateInstitution : handleUpdateInstitution}
      />

      {/* View Modal */}
      <InstitutionViewModal
        isOpen={showViewModal}
        institution={selectedInstitution}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInstitution(null);
        }}
      />

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Import Institutions from XLSX</h2>
              <button
                onClick={() => {
                  if (!isImporting) {
                    setShowImportModal(false);
                    setSelectedFile(null);
                    resetFileInput(fileInputRef);
                  }
                }}
                disabled={isImporting}
                className={`text-gray-500 hover:text-gray-700 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">


              <div className="p-8 text-center transition border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="xlsx-upload"
                />
                <label
                  htmlFor="xlsx-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload size={48} className="text-gray-400" />
                  <p className="font-medium text-gray-600">
                    {selectedFile ? selectedFile.name : "Click to select XLSX file"}
                  </p>
                  <p className="text-sm text-gray-500">or drag and drop (.xlsx, .xls)</p>
                </label>
              </div>

              {selectedFile && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <p className="text-sm text-green-800">
                    <strong>Selected:</strong> {selectedFile.name} (
                    {formatFileSize(selectedFile.size)})
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {importProgress < 85 ? 'Uploading file...' :
                        importProgress < 100 ? 'Processing data...' :
                          'Import complete!'}
                    </span>
                    <span className="font-medium text-[#313647]">{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#313647] h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center text-gray-600">
                    {importProgress < 100
                      ? 'Please wait while we process your file. Do not close this window...'
                      : 'Finalizing import...'}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting}
                  className="bg-[#313647] hover:bg-[#10192c] text-white"
                >
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Import Result Modal */}
      {showImportResultModal && importResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl border border-gray-200">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Import Summary</h2>
              <button
                onClick={() => {
                  setShowImportResultModal(false);
                  setImportResult(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="p-4 border border-gray-200 rounded bg-gray-50">
                  <p className="text-xs text-gray-500">Total Rows</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">
                    {importResult.summary.totalRows}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded bg-gray-50">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">
                    {importResult.summary.created}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded bg-gray-50">
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">
                    {importResult.summary.updated}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded bg-gray-50">
                  <p className="text-xs text-gray-500">Errors</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">
                    {importResult.summary.errors}
                  </p>
                </div>
              </div>

              {/* Imported / Updated List */}
              {importResult.data?.length > 0 && (
                <div>
                  <h3 className="mb-2 text-base font-semibold text-gray-800">
                    Processed Records ({importResult.data.length})
                  </h3>

                  <div className="p-3 space-y-2 overflow-y-auto border border-gray-200 rounded-lg max-h-64 bg-gray-50">
                    {importResult.data.map((institution, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{institution.name}</p>
                          <p className="text-xs text-gray-500">
                            {institution.country} • {institution.state} • {institution.sector}
                          </p>
                        </div>

                        <span className={`px-2 py-1 text-xs rounded border ${idx < importResult.summary.created
                            ? "text-green-700 bg-green-50 border-green-200"
                            : "text-blue-700 bg-blue-50 border-blue-200"
                          }`}>
                          {idx < importResult.summary.created ? "Created" : "Updated"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errors */}
              {(importResult.errors?.length ?? 0) > 0 && (
                <div>
                  <h3 className="mb-2 text-base font-semibold text-gray-800">
                    Errors ({importResult.errors?.length ?? 0})
                  </h3>

                  <div className="p-3 space-y-2 overflow-y-auto border border-gray-300 rounded-lg max-h-64 bg-gray-50">
                    {importResult.errors?.map((err, idx) => (
                      <div key={idx} className="p-3 bg-white border border-gray-300 rounded">
                        <p className="text-sm font-medium text-red-700">
                          Row {err.row}: {err.error}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          Data: {JSON.stringify(err.data)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setShowImportResultModal(false);
                    setImportResult(null);
                  }}
                  className="text-white bg-gray-800 hover:bg-gray-900"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
