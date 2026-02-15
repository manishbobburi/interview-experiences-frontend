import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import type { SignInPayload } from '../auth.types';
import { useAuth } from '../auth.context';

export default function SignInPage() {
  const [isOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignInPayload) => {
    try {
      setErrorMsg("");
      await signIn(data);
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Inavlid credentials';
      setErrorMsg(msg);
    }
  };

  return (
    <SignInModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
    />
  );
}
