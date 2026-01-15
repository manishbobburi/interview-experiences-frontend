import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import { signIn } from '../../../services/auth.api';
import type { SignInPayload } from '../auth.types';

export default function SignInPage() {
  const navigate = useNavigate();
  const [isOpen] = useState(true);

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignInPayload) => {
    try {
      const response = await signIn(data);
        const token = response.data.jwt;
        localStorage.setItem("token", token);
        navigate('/');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <SignInModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
