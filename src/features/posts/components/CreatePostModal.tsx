import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import { useAuth } from "../../auth/auth.context";
import BaseModal from "../../../components/BaseModal";
import type { CreatePostPayload } from "../post.types";
import { createPost } from "../../../services/posts.api";

export default function CreatePostModal() {
  const isOpen: boolean = true;
  const navigate = useNavigate();
  const { user } = useAuth();

  const onClose = () => {
    navigate(-1); // goes one entry back in the browser's navigation history.
  };

  const onSubmit = async (data: CreatePostPayload) => {
    data.userId = user?.id;
    await createPost(data);
    navigate(-1);
  };

  const [form, setForm] = useState<CreatePostPayload>({
    userId: user?.id,
    company: "",
    role: "",
    difficulty: "Easy",
    summary: "",
    isAnonymous: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Post">
      <div className="space-y-3">
        <input
          name="company"
          className="w-full border p-2"
          placeholder="Company"
          onChange={handleChange}
        />
        <input
          name="role"
          className="w-full border p-2"
          placeholder="Role"
          onChange={handleChange}
        />

        <select
          name="difficulty"
          className="w-full border p-2"
          onChange={handleChange}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          name="summary"
          className="w-full border p-2"
          rows={3}
          placeholder="Summary"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
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
          <Button onClick={() => onSubmit(form)} variant="primary">
            Create
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
