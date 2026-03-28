import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.context';
import type { SignUpPayload } from '../auth.types';
import SignUpModal from '../components/SignUpModal';
import { useToast } from '../../../context/ToastContext';
import { resendVerification } from '../../../services/auth.api';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (data: SignUpPayload) => {
    try {
      setErrorMsg("");
      await signUp(data);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.message || 'Inavlid credentials';
      setErrorMsg(msg);
      return;
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerification(submittedEmail);
      showToast("Verification email resent successfully!");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SignUpModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      isSuccess={isSuccess}
      submittedEmail={submittedEmail}
      isResending={isResending}
      onResend={handleResend}
    />
  );
}
