import Cookies from "js-cookie";

export const getToken = () => Cookies.get("jwt");

export const setToken = (token: string) => Cookies.set("jwt", token, { expires: 7, secure: true });

export const removeToken = () => Cookies.remove("jwt");

/**
 * Extracts the user's role from the JWT token.
 * 
 * @returns 'guest' | 'ApiaryUser' | 'Admin'
 */
export const getUserRole = (): 'guest' | 'ApiaryUser' | 'Admin' => {
  const token = getToken();
  if (!token) return 'guest';
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    
    // Extract roles from the token
    const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];

    // If the roles are a string (not an array), convert it to an array
    const roleList = Array.isArray(roles) ? roles : [roles];

    // Check for roles - if Admin is present, prioritize Admin
    if (roleList.includes('Admin')) return 'Admin';
    if (roleList.includes('ApiaryUser')) return 'ApiaryUser';

    return 'guest';
  } catch (error) {
    console.error('Failed to decode JWT payload:', error);
    return 'guest';
  }
};
