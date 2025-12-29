import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BaseModal from '../../../components/BaseModal';
import { signInSchema } from '../schemas';
import type { SignInPayload } from '../schemas';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SignInPayload) => void;
}

export default function SignInModal({ isOpen, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <BaseModal
      isOpen={isOpen}
      title="Sign In"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Sign In
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded border p-2"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
    </BaseModal>
  );
}
