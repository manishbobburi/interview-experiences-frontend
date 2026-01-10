import { useState } from 'react';
import BaseModal from '../../../components/BaseModal';
import type { SignUpPayload } from '../auth.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SignUpPayload) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUpModal({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<SignUpPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Create Account"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded border p-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded border p-2"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded border p-2"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
