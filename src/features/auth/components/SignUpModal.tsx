import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import Button from '../../../components/Button';
import type { SignUpPayload } from '../auth.types';
import { Mail } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: SignUpPayload) => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  isSuccess?: boolean;
  submittedEmail?: string;
  isResending?: boolean;
  onResend?: () => Promise<void>;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUpModal({ isOpen, onClose, onSubmit, errorMsg, setErrorMsg, isSuccess, submittedEmail, isResending, onResend }: Props) {
  const [formData, setFormData] = useState<SignUpPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and include letters & numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: SignUpPayload) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ // clear error for this field when user starts typing
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
          !isSuccess ? (
          <div className="flex items-center gap-3 flex-col w-full">
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              variant="primary"
            >
              {isSubmitting ? 'Provisioning account...' : 'Create Account'}
            </Button>
            <p className='text-gray-500 text-[14px] text-center'>Already registered? <span className='text-blue-700 underline underline-offset-3 cursor-pointer' onClick={() => navigate("/signin")}>Sign In</span></p>
          </div>
          ) : null
      }
    >
      {isSuccess ? (
        <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-black">Check your email</h3>
            <p className="text-center text-gray-500 mb-6 text-sm">
                We've sent a verification link to <br/><span className="text-black font-medium">{submittedEmail}</span>.
            </p>
            <Button 
                onClick={onResend}
                disabled={isResending}
                variant="primary"
                className="w-full"
            >
                {isResending ? "Dispatching..." : "Resend Email"}
                {isResending ? "Sending..." : "Resend Email"}
            </Button>
            <Button 
                onClick={() => navigate('/signin')}
                variant="secondary"
                className="w-full mt-3 border border-gray-200"
            >
                Return to Login
            </Button>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
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
      )}
    </BaseModal>
  );
}
