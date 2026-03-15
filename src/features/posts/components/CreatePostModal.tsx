import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAuth } from "../../auth/auth.context";
import type { CreatePostPayload } from "../post.types";
import { createPost } from "../../../services/posts.api";
import type { Company } from "../post.types";
import CompanySearch from "./CompanySearch";

interface FormErrors {
  company?: string;
  role?: string;
  difficulty?: string;
  summary?: string;
}

export default function CreatePostModal() {
  const { user } = useAuth();
  
  const [form, setForm] = useState<Omit<CreatePostPayload, "userId">>({
    companyId: 0,
    role: "",
    difficulty: "Easy",
    summary: "",
    isAnonymous: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.companyId || form.companyId == 0) {
      newErrors.company = "Company name is required";
    }

    if (!form.role || form.role.trim().length < 2) {
      newErrors.role = "Role must be at least 2 characters";
    }

    if (!form.difficulty) {
      newErrors.difficulty = "Difficulty is required";
    }

    if (!form.summary || form.summary.trim().length < 10) {
      newErrors.summary = "Summary must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onClose = () => {
    navigate(-1);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.id) {
      setErrors(prev => ({
        ...prev,
        userId: "User not authenticated"
      }));
      return;
    }

    setIsCreating(true);

    try {
      const payload: CreatePostPayload = {
        ...form,
        userId: user.id,
      };

      await createPost(payload);

      navigate(-1);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        summary: "Failed to create post. Try again."
      }));
    } finally {
      setIsCreating(false);
    }
 };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as keyof typeof prev]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    setErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
  };

  const handleCompanySelect = (company: Company) => {
  setForm(prev => ({
    ...prev,
    companyId: company.id,
  }));

  setErrors(prev => ({
    ...prev,
    company: undefined,
  }));
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (
    e.key === "Enter" &&
    (e.target as HTMLElement).tagName !== "BUTTON"
  ) {
    e.preventDefault();
  }
};

  return (
    <div className="fixed inset-0 top-16 z-50 flex items-start justify-center overflow-y-auto bg-gray-50/80 backdrop-blur-sm px-4 py-6 sm:py-10">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden"
        style={{ minHeight: "calc(100vh - 64px - 80px)" }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Drop your interview story</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Help a fellow candidate nail their next interview
          </p>
        </div>

        <form 
        onSubmit={onSubmit}
        onKeyDown={handleKeyDown}
        className="flex flex-col flex-1 px-6 py-5 gap-5">

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Company
              </label>
              <CompanySearch handleSelect={handleCompanySelect} />
              {errors.company && (
                <p className="text-xs text-red-500">{errors.company}</p>
              )}
            </div>

            <div className="sm:w-44 flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:border-gray-400 transition"
              >
                <option>Easy</option>
                <option>Easy-Medium</option>
                <option>Medium</option>
                <option>Medium-Hard</option>
                <option>Hard</option>
              </select>
              {errors.difficulty && (
                <p className="text-xs text-red-500">{errors.difficulty}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Role
            </label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition"
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role}</p>
            )}
          </div>

          <div className="flex flex-col flex-1 gap-1 min-h-0">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Interview Summary
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Describe the interview rounds, questions asked, atmosphere, tips for others…"
              className="flex-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 leading-relaxed resize-none focus:outline-none focus:border-gray-400 transition min-h-45"
            />
            {errors.summary && (
              <p className="text-xs text-red-500">{errors.summary}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100">
            <label className="flex items-center gap-2.5 group w-fit">
              <div className="relative cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  name="isAnonymous"
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-gray-900 transition-colors duration-200" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Post anonymously
              </span>
            </label>

            <div className="flex gap-2 sm:justify-end">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button disabled={isCreating} type="submit" variant="primary">
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
