import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyEmail } from '../../../services/auth.api';
import Button from '../../../components/Button';
import { useAuth } from '../../auth/auth.context';

export default function VerifyEmailPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'already-verified' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState("");
    const token = searchParams.get('token');
    const hasAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage("Invalid or missing verification token.");
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        verifyEmail(token)
            .then((res: any) => {
                if (res?.data?.message === "This email address is already verified") {
                    setStatus('already-verified');
                } else {
                    setStatus('success');
                }
            })
            .catch((err: any) => {
                setStatus('error');
                setErrorMessage(err?.response?.data?.message || "Verification failed. The provided security token may be invalid or expired.");
            });
    }, [token]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-lg p-8 text-center flex flex-col items-center">
                
                {status === 'loading' && (
                    <>
                        <Loader2 className="animate-spin text-gray-500 mb-6" size={48} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Authenticating request</h2>
                        <p className="text-gray-500">Please wait while we securely process your verification token...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Verified</h2>
                        <p className="text-gray-500 mb-8">Your account has been verified successfully.</p>
                        <Button 
                            onClick={() => navigate(user ? '/' : '/signin?verified=true')}
                            variant="primary"
                            className="w-full"
                        >
                            {user ? 'Go to Home' : 'Continue to Login'}
                        </Button>
                    </>
                )}

                {status === 'already-verified' && (
                    <>
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Already Verified</h2>
                        <p className="text-gray-500 mb-8">This email address has already been verified.</p>
                        <Button 
                            onClick={() => navigate(user ? '/' : '/signin')}
                            variant="primary"
                            className="w-full"
                        >
                            {user ? 'Go to Home' : 'Continue to Login'}
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                            <XCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h2>
                        <p className="text-gray-500 mb-8">{errorMessage}</p>
                        <Button 
                            onClick={() => navigate(user ? '/' : '/signin')}
                            variant="secondary"
                            className="w-full border border-gray-200"
                        >
                            {user ? 'Go to Home' : 'Back to Login'}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
