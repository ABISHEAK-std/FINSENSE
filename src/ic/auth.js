import { AuthClient } from "@dfinity/auth-client";

// Mock authentication for development
const MOCK_AUTH_KEY = 'finsense_mock_auth';
const ICP_ACCOUNT_KEY = 'finsense_icp_account';

export async function getAuthClient() {
  try {
    return await AuthClient.create();
  } catch (error) {
    console.warn("AuthClient creation failed, using mock authentication:", error);
    return null;
  }
}

// Check if user has an ICP account
export function hasICPAccount() {
  return localStorage.getItem(ICP_ACCOUNT_KEY) === 'true';
}

// Set ICP account status
export function setICPAccountStatus(hasAccount) {
  localStorage.setItem(ICP_ACCOUNT_KEY, hasAccount.toString());
}

// Get user's ICP principal ID
export function getICPPrincipal() {
  return localStorage.getItem('icp_principal_id');
}

// Set user's ICP principal ID
export function setICPPrincipal(principalId) {
  localStorage.setItem('icp_principal_id', principalId);
}

export async function login() {
  try {
    const authClient = await getAuthClient();
    if (authClient) {
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider:
            import.meta.env.VITE_II_URL || "https://identity.ic0.app",
          onSuccess: async () => {
            try {
              // Get the identity and store principal ID
              const identity = authClient.getIdentity();
              const principal = identity.getPrincipal();
              setICPPrincipal(principal.toString());
              setICPAccountStatus(true);
              
              console.log('ICP login successful, principal:', principal.toString());
              
              // Dispatch custom event to notify the app
              window.dispatchEvent(new CustomEvent('icp-login-success', {
                detail: { principal: principal.toString() }
              }));
              // Hard reload to reinitialize app state and routing
              try {
                setTimeout(() => {
                  if (typeof window !== 'undefined' && window.location && window.location.reload) {
                    window.location.reload();
                  }
                }, 200);
              } catch {}

              resolve({ success: true, principal: principal.toString() });
            } catch (error) {
              console.error('Error in ICP login success handler:', error);
              reject(error);
            }
          },
          onError: (error) => {
            console.error('ICP login error:', error);
            reject(error);
          }
        });
      });
    } else {
      // Mock login for development
      localStorage.setItem(MOCK_AUTH_KEY, 'true');
      setICPAccountStatus(false);
      console.log('Using mock authentication for development');
      return { success: true, principal: 'mock-principal-id' };
    }
  } catch (error) {
    console.warn("Login failed, using mock authentication:", error);
    localStorage.setItem(MOCK_AUTH_KEY, 'true');
    setICPAccountStatus(false);
    throw error;
  }
}

// Clear all stored credentials
export function clearAllCredentials() {
  // Clear all localStorage items related to authentication
  localStorage.removeItem(MOCK_AUTH_KEY);
  localStorage.removeItem(ICP_ACCOUNT_KEY);
  localStorage.removeItem('icp_principal_id');
  
  // Clear any other potential auth-related items
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('finsense') || 
      key.includes('icp') || 
      key.includes('auth') ||
      key.includes('identity') ||
      key.includes('principal')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('All credentials cleared');
}

export async function logout() {
  try {
    const authClient = await getAuthClient();
    if (authClient) {
      await authClient.logout();
    }
    
    // Clear all credentials
    clearAllCredentials();
    
    console.log('Logout successful');
    window.location.reload();
  } catch (error) {
    console.warn("Logout failed, clearing credentials anyway:", error);
    clearAllCredentials();
    window.location.reload();
  }
}

export async function getIdentity() {
  try {
    const authClient = await getAuthClient();
    if (authClient) {
      return authClient.getIdentity();
    } else {
      // Return mock identity for development
      return {
        getPrincipal: () => ({ toString: () => 'mock-principal-id' })
      };
    }
  } catch (error) {
    console.warn("Failed to get identity, using mock identity:", error);
    return {
      getPrincipal: () => ({ toString: () => 'mock-principal-id' })
    };
  }
}

export async function isAuthenticated() {
  try {
    const authClient = await getAuthClient();
    if (authClient) {
      const authenticated = await authClient.isAuthenticated();
      if (authenticated) {
        // Update ICP account status
        setICPAccountStatus(true);
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        setICPPrincipal(principal.toString());
      }
      return authenticated;
    } else {
      // Check mock authentication
      return localStorage.getItem(MOCK_AUTH_KEY) === 'true';
    }
  } catch (error) {
    console.warn("Authentication check failed, using mock authentication:", error);
    return localStorage.getItem(MOCK_AUTH_KEY) === 'true';
  }
}