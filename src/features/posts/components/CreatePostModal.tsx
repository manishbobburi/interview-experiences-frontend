import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth.context";
import type { CreatePostPayload } from "../post.types";
import { createPost } from "../../../services/posts.api";
import type { Company } from "../post.types";
import PostForm from "./PostForm";

interface FormErrors {
  company?: string;
  role?: string;
  difficulty?: string;
  summary?: string;
}

export default function CreatePostModal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<CreatePostPayload, "userId">>({
    companyId: 0,
    role: "",
    difficulty: "Easy",
    summary: "",
    isAnonymous: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user && !user.verified) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.companyId || form.companyId == 0)
      newErrors.company = "Company name is required";
    if (!form.role || form.role.trim().length < 2)
      newErrors.role = "Role must be at least 2 characters";
    if (!form.difficulty)
      newErrors.difficulty = "Difficulty is required";
    if (!form.summary || form.summary.trim().length < 10)
      newErrors.summary = "Summary must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.id) return;
    setIsCreating(true);
    try {
      await createPost({ ...form, userId: user.id });
      navigate(-1);
    } catch {
      setErrors((prev) => ({ ...prev, summary: "Unable to publish experience. Please try again later." }));
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCompanySelect = (company: Company) => {
    setForm((prev) => ({ ...prev, companyId: company.id }));
    setErrors((prev) => ({ ...prev, company: undefined }));
  };

  return (
    <PostForm
      mode="create"
      summary={form.summary}
      onSummaryChange={(val) => {
        setForm((prev) => ({ ...prev, summary: val }));
        setErrors((prev) => ({ ...prev, summary: undefined }));
      }}
      summaryError={errors.summary}
      companyError={errors.company}
      roleValue={form.role}
      roleError={errors.role}
      difficultyValue={form.difficulty}
      difficultyError={errors.difficulty}
      isAnonymous={form.isAnonymous}
      onFieldChange={handleChange}
      onCompanySelect={handleCompanySelect}
      isSubmitting={isCreating}
      onSubmit={onSubmit}
      onClose={() => navigate(-1)}
    />
  );
}
