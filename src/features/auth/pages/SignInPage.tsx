import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import type { SignInPayload } from '../auth.types';
import { useAuth } from '../auth.context';
import { useToast } from '../../../context/ToastContext';

export default function SignInPage() {
  const [isOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignInPayload) => {
    try {
      setErrorMsg("");
      const res = await signIn(data);
      if(res.success) {
        showToast("Signed in as "+ res.data.user.email)
      }
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
