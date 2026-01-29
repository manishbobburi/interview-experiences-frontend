import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../components/SignUpModal';
import { signUp } from '../../../services/auth.api';
import type { SignUpPayload } from '../auth.types';
import { handleComponentError } from '../../../utils/componentErrorHandler';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isOpen] = useState(true);

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignUpPayload) => {
    try {
      await signUp(data);
      navigate('/');
      return;
    } catch (err: any) {
        handleComponentError(err, navigate);
        return;
    }
  };

  return (
    <SignUpModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    />
  );
}
