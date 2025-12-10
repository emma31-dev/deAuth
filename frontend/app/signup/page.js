"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { userAtom } from "../../utils/atom";
import { useAtom } from "jotai";
import { FcGoogle } from "react-icons/fc"
import { FaWallet, FaSpinner } from "react-icons/fa"
import { authService } from "../../utils/auth"
import { validateEmail, validatePassword, validatePasswordMatch } from "../../utils/validation"

export default function signup() {
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleEmailSignup = async () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (!validatePasswordMatch(password, confirmPassword)) {
            alert('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const result = await authService.loginWithEmail(email, 'email', password);
            if (result.success) {
                setUser({
                    name: result.user.identifier,
                    method: result.user.auth_provider,
                    createdAt: new Date().toISOString()
                });
                router.push('/dashboard');
            } else {
                alert(result.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup failed:', error);
        }
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            const googleEmail = await getGoogleAccount();
            if (googleEmail) {
                const result = await authService.loginWithEmail(googleEmail, 'gmail');
                if (result.success) {
                    setUser({
                        name: result.user.identifier,
                        method: result.user.auth_provider,
                        createdAt: new Date().toISOString()
                    });
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error('Google signup failed:', error);
        }
        setLoading(false);
    };

    const getGoogleAccount = async () => {
        return 'user@gmail.com';
    };

    const handleWalletSignup = async () => {
        setLoading(true);
        try {
            const walletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87';
            const { nonce } = await authService.getNonce(walletAddress);
            const signature = 'mock_signature';
            
            const result = await authService.loginWithWallet(walletAddress, signature);
            if (result.success) {
                setUser({
                    name: result.user.identifier,
                    method: result.user.auth_provider,
                    createdAt: new Date().toISOString()
                });
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Wallet signup failed:', error);
        }
        setLoading(false);
    };

    const goToSignin = () => { router.push("/signin") }

    return (
        <div className="flex min-h-screen items-center justify-center bg-foreground/5 font-sans dark:bg-black">
            <div className="bg-white py-8 px-4 flex flex-col gap-10 w-full rounded-md md:w-80">
                <h1 className="text-2xl text-foreground font-extrabold">Sign up</h1>
                <div className="flex flex-col gap-4">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Enter email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (!validateEmail(e.target.value) && e.target.value) {
                                    setEmailError('Invalid email format');
                                } else {
                                    setEmailError('');
                                }
                            }}
                            className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 transition duration-300 ${
                                emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                            }`}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (!validatePassword(e.target.value) && e.target.value) {
                                    setPasswordError('Password must be at least 6 characters');
                                } else {
                                    setPasswordError('');
                                }
                                // Check confirm password match when password changes
                                if (confirmPassword && !validatePasswordMatch(e.target.value, confirmPassword)) {
                                    setConfirmPasswordError('Passwords do not match');
                                } else {
                                    setConfirmPasswordError('');
                                }
                            }}
                            className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 transition duration-300 ${
                                passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                            }`}
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Confirm password" 
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (!validatePasswordMatch(password, e.target.value) && e.target.value) {
                                    setConfirmPasswordError('Passwords do not match');
                                } else {
                                    setConfirmPasswordError('');
                                }
                            }}
                            className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 transition duration-300 ${
                                confirmPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                            }`}
                        />
                        {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleEmailSignup}
                        disabled={loading || !email || !password || !confirmPassword || emailError || passwordError || confirmPasswordError}
                        className="bg-main text-white py-2 w-full hover:bg-main/80 active:scale-95 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? <><FaSpinner className="animate-spin mr-2" />Creating account...</> : 'Sign up'}
                    </button>
                    <div className="flex justify-center">
                        <p>Already have an account?</p>
                        <button onClick={goToSignin} className="bg-none text-main font-bold ml-1">sign in</button>
                    </div>
                    <button 
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="bg-white text-black flex items-center gap-2 py-2 justify-center w-full shadow-md rounded-sm disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FcGoogle />}
                        <span>Sign up with Google</span>
                    </button>
                    <button 
                        onClick={handleWalletSignup}
                        disabled={loading}
                        className="bg-black text-white flex items-center gap-2 justify-center py-2 w-full shadow-md rounded-sm disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaWallet className="flex m-0" />}
                        <span>Sign up with Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    )
}