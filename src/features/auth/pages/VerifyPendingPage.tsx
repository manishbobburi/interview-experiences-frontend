import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { resendVerification } from '../../../services/auth.api';
import { useToast } from '../../../context/ToastContext';

export default function VerifyPendingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isResending, setIsResending] = useState(false);

    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/" replace />;
    }

    const handleResend = async () => {
        setIsResending(true);
        try {
            await resendVerification(email);
            showToast("Verification email resent successfully!");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to resend email. Please try again.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
                    <Mail size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
                <p className="text-zinc-400 mb-8">
                    We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
                    Please follow the standard verification steps to activate your account.
                </p>
                <div className="flex flex-col w-full gap-3">
                    <button 
                        onClick={handleResend}
                        disabled={isResending}
                        className="w-full py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? "Sending..." : "Resend Email"}
                    </button>
                    <button 
                        onClick={() => navigate('/signin')}
                        className="w-full py-3 px-4 bg-transparent border border-zinc-700 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
