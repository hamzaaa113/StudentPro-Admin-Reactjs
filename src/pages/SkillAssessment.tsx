import { useState, useRef } from "react";
import { useSkillAssessments } from "../hooks/useSkillAssessment";
import { Button } from "../components/ui/Button";
import type {
  SkillAssessment,
  CreateSkillAssessmentData,
  UpdateSkillAssessmentData,
  XLSXImportResponse,
} from "../types/skillAssessment.types";
import SkillAssessmentModal from "../components/SkillAssessmentModal";
import SkillAssessmentTable from "../components/SkillAssessmentTable";
import SkillAssessmentViewModal from "../components/SkillAssessmentViewModal";
import { Download, Upload, X } from "lucide-react";

export default function SkillAssessment() {
  const [pageSize] = useState(100);
  const {
    skillAssessments,
    loading,
    createSkillAssessment,
    updateSkillAssessment,
    deleteSkillAssessment,
    exportToXLSX,
    importFromXLSX,
    downloadTemplate,
    exporting,
    importing,
  } = useSkillAssessments({ page: 1, pageSize });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportResultModal, setShowImportResultModal] = useState(false);
  const [selectedSkillAssessment, setSelectedSkillAssessment] = useState<SkillAssessment | null>(
    null
  );
  const [importResult, setImportResult] = useState<XLSXImportResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async (data: CreateSkillAssessmentData) => {
    return await createSkillAssessment(data);
  };

  const handleEdit = (skillAssessment: SkillAssessment) => {
    setSelectedSkillAssessment(skillAssessment);
    setShowEditModal(true);
  };

  const handleUpdate = async (data: UpdateSkillAssessmentData) => {
    if (!selectedSkillAssessment) return false;
    return await updateSkillAssessment(selectedSkillAssessment._id, data);
  };

  const handleDelete = async (id: string) => {
    await deleteSkillAssessment(id);
  };

  const handleView = (skillAssessment: SkillAssessment) => {
    setSelectedSkillAssessment(skillAssessment);
    setShowViewModal(true);
  };

  const handleExport = async () => {
    await exportToXLSX();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      const result = await importFromXLSX(selectedFile, (progress) => {
        setImportProgress(progress);
      });
      setImportResult(result);
      setShowImportModal(false);
      setShowImportResultModal(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const resetFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Skill Assessment</h1>
                <p className="mt-1 text-sm text-gray-600 truncate md:text-base">
                  Manage skill assessment information
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="flex items-center gap-2"
                disabled={importing}
              >
                <Upload size={16} />
                {importing ? 'Importing...' : 'Import'}
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
                disabled={exporting}
              >
                <Download size={16} />
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#0A1F38] text-white hover:bg-[#0A1F38] hover:shadow-lg"
              >
                + Add New Assessment
              </Button>
            </div>
          </div>
        </div>

    
  {/* Showing count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {Math.min(skillAssessments.length, pageSize)} of {skillAssessments.length} {skillAssessments.length === 1 ? 'assessment' : 'assessments'}
            </p>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-b-2 border-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <SkillAssessmentTable
            skillAssessments={skillAssessments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* Modals */}
      <SkillAssessmentModal
        isOpen={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
      <SkillAssessmentModal
        isOpen={showEditModal}
        mode="edit"
        skillAssessment={selectedSkillAssessment}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSkillAssessment(null);
        }}
        onSubmit={handleUpdate}
      />
      <SkillAssessmentViewModal
        isOpen={showViewModal}
        skillAssessment={selectedSkillAssessment}
        onClose={() => {
          setShowViewModal(false);
          setSelectedSkillAssessment(null);
        }}
      />

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Import Skill Assessments from XLSX</h2>
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
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Upload an XLSX file with skill assessment data. The file should contain columns for occupation groups, pathways/streams, fees, processing times, and other assessment details.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="mt-2 text-sm font-medium text-blue-700 underline hover:text-blue-900"
                >
                  Download Template
                </button>
              </div>

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
                    {importResult.data.map((assessment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{assessment.occupationGroups}</p>
                          <p className="text-xs text-gray-500">
                            {assessment.pathwaysStreams}
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
