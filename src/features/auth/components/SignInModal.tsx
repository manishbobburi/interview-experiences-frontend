import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import Button from '../../../components/Button';
import type { SignInPayload } from '../auth.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SignInPayload) => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignInModal({ isOpen, onClose, onSubmit, errorMsg, setErrorMsg }: Props) {
  const [formData, setFormData] = useState<SignInPayload>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    setErrorMsg("");
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
      setFormData({ email: '', password: '' });
      setErrors({});
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Sign In"
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3 flex-col w-full">
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            variant="primary"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </Button>
            <p className='text-gray-500 text-[14px] text-center'>New to Platform? <span className='text-blue-700 underline underline-offset-3 cursor-pointer' onClick={() => navigate("/signup")}>Create an account</span></p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
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
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
          {errorMsg && (
            <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
          )}
        </div>
      </form>
    </BaseModal>
  );
}
