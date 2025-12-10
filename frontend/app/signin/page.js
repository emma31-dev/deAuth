"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { userAtom } from "../../utils/atom";
import { useAtom } from "jotai";
import { FcGoogle } from "react-icons/fc"
import { FaWallet, FaSpinner } from "react-icons/fa"
import { authService } from "../../utils/auth"
import { validateEmail, validatePassword } from "../../utils/validation"

export default function signin() {
    const router = useRouter();
    const [user, setUser] = useAtom(userAtom);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailLogin = async () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            alert('Password must be at least 6 characters');
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
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            // Check for Google account on device
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
            console.error('Google login failed:', error);
        }
        setLoading(false);
    };

    const getGoogleAccount = async () => {
        // Simulate Google account detection
        return 'user@gmail.com';
    };

    const handleWalletLogin = async () => {
        setLoading(true);
        try {
            // Simplified wallet connection
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
            console.error('Wallet login failed:', error);
        }
        setLoading(false);
    };

    const goToSignup = () => { router.push("/signup") }

    return (
        <div className="flex min-h-screen items-center justify-center bg-foreground/5 font-sans dark:bg-black">
            <div className="bg-white py-8 px-4 flex flex-col gap-10 w-full rounded-md md:w-80">
                <h1 className="text-2xl text-foreground font-extrabold">Sign in</h1>
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
                            }}
                            className={`w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 transition duration-300 ${
                                passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                            }`}
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleEmailLogin}
                        disabled={loading || !email || !password || emailError || passwordError}
                        className="bg-main text-white py-2 w-full hover:bg-main/80 active:scale-95 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? <><FaSpinner className="animate-spin mr-2" />Signing in...</> : 'Sign in'}
                    </button>
                    <div className="flex justify-center">
                        <p>Don't have an account?</p>
                        <button onClick={goToSignup} className="bg-none text-main font-bold ml-1">sign up</button>
                    </div>
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="bg-white text-black flex items-center gap-2 py-2 justify-center w-full shadow-md rounded-sm disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FcGoogle />}
                        <span>Sign in with Google</span>
                    </button>
                    <button 
                        onClick={handleWalletLogin}
                        disabled={loading}
                        className="bg-black text-white flex items-center gap-2 justify-center py-2 w-full shadow-md rounded-sm disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaWallet className="flex m-0" />}
                        <span>Sign in with Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    )
}