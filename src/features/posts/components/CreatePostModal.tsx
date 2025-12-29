// CreatePostModal.tsx
import { useState } from 'react';
import BaseModal from '../../../components/BaseModal';
import type { CreatePostPayload } from '../post.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostPayload) => void;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CreatePostPayload>({
    company: "",
    role: "",
    difficulty: "Easy",
    summary: "",
    isAnonymous: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create Post">
      <div className="space-y-3">
        <input name="company" className="w-full border p-2" placeholder="Company" onChange={handleChange} />
        <input name="role" className="w-full border p-2" placeholder="Role" onChange={handleChange} />

        <select name="difficulty" className="w-full border p-2" onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea name="summary" className="w-full border p-2" rows={3} placeholder="Summary" onChange={handleChange} />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isAnonymous" onChange={handleChange} />
          Post anonymously
        </label>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit(form)} className="bg-black px-4 py-2 text-white">
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
