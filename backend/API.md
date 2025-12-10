# deAuth API Documentation

Base URL: `http://localhost:3000`

## Authentication Endpoints

### 1. Generate Nonce (Wallet Auth Only)
**POST** `/auth/nonce`

Generate a nonce for wallet authentication using SIWE.

**Request Body:**
```json
{
  "identifier": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87"
}
```

**Response:**
```json
{
  "nonce": "a1b2c3d4e5f6789..."
}
```

### 2. Login/Register
**POST** `/auth/login`

Authenticate or register a user with email, Gmail, or wallet.

#### Email/Gmail Authentication
**Request Body:**
```json
{
  "auth_provider": "email", // or "gmail"
  "identifier": "user@example.com"
}
```

#### Wallet Authentication
**Request Body:**
```json
{
  "auth_provider": "wallet",
  "identifier": "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
  "signature": "0x..."
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "auth_provider": "email",
    "identifier": "user@example.com",
    "nonce": null
  }
}
```

**Error Response:**
```json
{
  "error": "User not found"
}
```

## Frontend Integration Flow

### Email/Gmail Flow:
1. User enters email
2. Call `POST /auth/login` with email
3. Handle success/error response

### Wallet Flow:
1. Connect wallet
2. Call `POST /auth/nonce` with wallet address
3. Sign message with nonce using SIWE
4. Call `POST /auth/login` with signature
5. Handle success/error response

## User Schema
```json
{
  "id": "number",
  "auth_provider": "email | gmail | wallet",
  "identifier": "string", // email or wallet address
  "nonce": "string | null" // only for wallet users
}
```