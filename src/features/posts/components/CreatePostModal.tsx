import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAuth } from "../../auth/auth.context";
import BaseModal from "../../../components/BaseModal";
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
  const isOpen: boolean = true;
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

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Post">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <CompanySearch handleSelect={handleCompanySelect}/>
          {errors.company && (
            <p className="text-sm text-red-500 mt-1">{errors.company}</p>
          )}
        </div>
        <div>
          <input
          name="role"
          value={form.role}
          className="w-full border p-2"
          placeholder="Role"
          onChange={handleChange}
          />
          {errors.role && (
            <p className="text-sm text-red-500 mt-1">{errors.role}</p>
          )}
        </div>
        <div>
          <select
          name="difficulty"
          value={form.difficulty}
          className="w-full border p-2"
          onChange={handleChange}
          >
          <option>Easy</option>
          <option>Easy-Medium</option>
          <option>Medium</option>
          <option>Medium-Hard</option>
          <option>Hard</option>
          </select>
          {errors.difficulty && (
            <p className="text-sm text-red-500 mt-1">{errors.difficulty}</p>
          )}
        </div>
        
        <div>
          <textarea
          name="summary"
          value={form.summary}
          className="w-full border p-2"
          rows={3}
          placeholder="Summary"
          onChange={handleChange}
          />
          {errors.summary && (
            <p className="text-sm text-red-500 mt-1">{errors.summary}</p>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            name="isAnonymous"
            onChange={handleChange}
            className="cursor-pointer"
          />
          Post anonymously
        </label>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button disabled={isCreating} type="submit" variant="primary">
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
