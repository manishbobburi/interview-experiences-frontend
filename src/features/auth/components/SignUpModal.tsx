// SignUpModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BaseModal from '../../../components/BaseModal';
import { signUpSchema } from '../schemas';
import type { SignUpPayload } from '../schemas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignUpPayload) => void;
}

export default function SignUpModal({ isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });

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
            onClick={handleSubmit(onSubmit)}
            className="rounded bg-black px-4 py-2 text-sm text-white"
          >
            Sign Up
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <input {...register("name")} placeholder="Full Name" className="input" />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input {...register("email")} placeholder="Email" className="input" />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>
    </BaseModal>
  );
}
