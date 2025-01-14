export const checkTokenValidity = () => {
  const tokenData = localStorage.getItem('jwtToken');
  
  if (!tokenData) return false;

  try {
    const { value, timestamp, expiresIn } = JSON.parse(tokenData);
    const now = new Date().getTime();
    
    if (now - timestamp > expiresIn) {
      localStorage.removeItem('jwtToken');
      return false;
    }
    
    return true;
  } catch {
    localStorage.removeItem('jwtToken');
    return false;
  }
};