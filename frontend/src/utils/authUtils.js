export const setupTokenCleanup = () => {
  window.addEventListener('beforeunload', cleanupTokenOnClose);
  window.addEventListener('unload', cleanupTokenOnClose);
};

export const cleanupTokenOnClose = () => {
  localStorage.removeItem('jwtToken');
};

export const setToken = (token) => {
  const tokenData = {
    value: token,
    timestamp: new Date().getTime(),
    expiresIn: 3600000
  };
  localStorage.setItem('jwtToken', JSON.stringify(tokenData));
};

export const getToken = () => {
  const tokenData = localStorage.getItem('jwtToken');
  if (!tokenData) return null;
  
  try {
    const { value, timestamp, expiresIn } = JSON.parse(tokenData);
    const now = new Date().getTime();
    
    if (now - timestamp > expiresIn) {
      localStorage.removeItem('jwtToken');
      return null;
    }
    
    return value;
  } catch {
    localStorage.removeItem('jwtToken');
    return null;
  }
};

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
};