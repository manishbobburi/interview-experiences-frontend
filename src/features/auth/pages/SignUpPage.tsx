import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context';
import type { SignUpPayload } from '../auth.types';
import SignUpModal from '../components/SignUpModal';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { signUp } = useAuth();

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignUpPayload) => {
    try {
      setErrorMsg("");
      await signUp(data);
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Inavlid credentials';
      setErrorMsg(msg);
      return;
    }
  };

  return (
    <SignUpModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
    />
  );
}
