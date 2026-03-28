import Button from "../../../components/Button";
import CompanySearch from "./CompanySearch";
import RichTextEditor from "./RichTextEditor";
import type { Company } from "../post.types";

interface ReadOnlyFields {
  company: string;
  difficulty: string;
  role: string;
}

interface PostFormProps {
  // Mode
  mode: "create" | "edit";

  // Summary (editable in both modes)
  summary: string;
  onSummaryChange: (val: string) => void;
  summaryError?: string;

  // Create-only fields
  companyError?: string;
  roleValue?: string;
  roleError?: string;
  difficultyValue?: string;
  difficultyError?: string;
  isAnonymous?: boolean;
  onFieldChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onCompanySelect?: (company: Company) => void;

  // Edit-only read-only display
  readOnly?: ReadOnlyFields;

  // Submission
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function PostForm({
  mode,
  summary,
  onSummaryChange,
  summaryError,
  companyError,
  roleValue,
  roleError,
  difficultyValue,
  difficultyError,
  isAnonymous,
  onFieldChange,
  onCompanySelect,
  readOnly,
  isSubmitting,
  onSubmit,
  onClose,
}: PostFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") {
      e.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 top-16 z-50 flex items-start justify-center overflow-y-auto bg-gray-50/80 backdrop-blur-sm px-4 py-6 sm:py-10"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden"
        style={{ minHeight: "calc(100vh - 64px - 80px)" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Share your experience" : "Edit your experience"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {mode === "create"
              ? "Help others by sharing your interview experience"
              : "Only the interview summary can be edited"}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          onKeyDown={handleKeyDown}
          className="flex flex-col flex-1 px-6 py-5 gap-5"
        >
          {/* Company + Difficulty */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Company
              </label>
              {mode === "create" ? (
                <>
                  <CompanySearch handleSelect={onCompanySelect!} />
                  {companyError && (
                    <p className="text-xs text-red-500">{companyError}</p>
                  )}
                </>
              ) : (
                <div className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                  {readOnly?.company || "—"}
                </div>
              )}
            </div>

            <div className="sm:w-44 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Difficulty
              </label>
              {mode === "create" ? (
                <>
                  <select
                    name="difficulty"
                    value={difficultyValue}
                    onChange={onFieldChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                  >
                    <option>Easy</option>
                    <option>Easy-Medium</option>
                    <option>Medium</option>
                    <option>Medium-Hard</option>
                    <option>Hard</option>
                  </select>
                  {difficultyError && (
                    <p className="text-xs text-red-500">{difficultyError}</p>
                  )}
                </>
              ) : (
                <div className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                  {readOnly?.difficulty || "—"}
                </div>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Role
            </label>
            {mode === "create" ? (
              <>
                <input
                  name="role"
                  value={roleValue}
                  onChange={onFieldChange}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                />
                {roleError && (
                  <p className="text-xs text-red-500">{roleError}</p>
                )}
              </>
            ) : (
              <div className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                {readOnly?.role || "—"}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="flex flex-col flex-1 gap-1 min-h-0">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Interview Summary
            </label>
            <div className="flex-1 flex flex-col min-h-0">
              <RichTextEditor
                value={summary}
                onChange={onSummaryChange}
                placeholder={
                  mode === "create"
                    ? "Describe the interview rounds, questions asked, atmosphere, tips for others…"
                    : "Update your interview summary…"
                }
                hasError={!!summaryError}
              />
            </div>
            {summaryError && (
              <p className="text-xs text-red-500">{summaryError}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
            {/* Anonymous toggle — create only */}
            {mode === "create" ? (
              <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    name="isAnonymous"
                    onChange={onFieldChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-gray-900 transition-colors duration-200" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Post anonymously
                </span>
              </label>
            ) : (
              <div /> // spacer to keep buttons right-aligned
            )}

            <div className="flex gap-2 sm:justify-end">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit" variant="primary">
                {mode === "create"
                  ? isSubmitting ? "Creating..." : "Create"
                  : isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
