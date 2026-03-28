import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import type { SignInPayload } from '../auth.types';
import { useAuth } from '../auth.context';
import { useToast } from '../../../context/ToastContext';

export default function SignInPage() {
  const [isOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true" && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast("Email verified successfully! You can now log in.");
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("verified");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast]);

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
