const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000';

export const authService = {
  // Email/Gmail authentication
  async loginWithEmail(email, authProvider = 'email', password = null) {
    const body = {
      auth_provider: authProvider,
      identifier: email
    };
    if (password) body.password = password;
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    } catch (error) {
      return { error: 'Backend server not running. Please start the backend.' };
    }
  },

  // Wallet authentication
  async getNonce(walletAddress) {
    try {
      const response = await fetch(`${API_BASE}/auth/nonce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: walletAddress })
      });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    } catch (error) {
      return { error: 'Backend server not running. Please start the backend.' };
    }
  },

  async loginWithWallet(walletAddress, signature) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_provider: 'wallet',
          identifier: walletAddress,
          signature
        })
      });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    } catch (error) {
      return { error: 'Backend server not running. Please start the backend.' };
    }
  }
};