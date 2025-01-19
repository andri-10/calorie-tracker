let isNavigatingToLandingPage = false;
let serverCheckInterval = null;
let lastSuccessfulCheck = Date.now();

export const setupTokenCleanup = () => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  startServerCheck();

  // Check immediately when setting up
  checkServerStatus();
};

const checkServerStatus = async () => {
  try {
    // Check backend health
    const backendResponse = await fetch('http://localhost:8080/users/health', {
      method: 'HEAD',
      timeout: 5000 // 5 second timeout
    });
    
    if (!backendResponse.ok) {
      handleServerDown('Backend server is down');
      return;
    }

    // Check frontend by attempting to access the root
    const frontendResponse = await fetch('http://localhost:3000', {
      method: 'HEAD',
      timeout: 5000
    });

    if (!frontendResponse.ok) {
      handleServerDown('Frontend server is down');
      return;
    }

    lastSuccessfulCheck = Date.now();
  } catch (error) {
    // If either check fails, handle server down
    handleServerDown(error.message);
  }
};

const startServerCheck = () => {
  if (serverCheckInterval) {
    clearInterval(serverCheckInterval);
  }

  // Check every 5 seconds
  serverCheckInterval = setInterval(checkServerStatus, 5000);
};

const handleServerDown = (reason) => {
  console.log('Server down detected:', reason);
  const timeSinceLastCheck = Date.now() - lastSuccessfulCheck;
  
  // If it's been more than 10 seconds since last successful check
  if (timeSinceLastCheck > 10000) {
    clearToken();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

const handleBeforeUnload = () => {
  if (!isNavigatingToLandingPage) {
    const isRefresh = sessionStorage.getItem('isPageRefresh');
    if (!isRefresh) {
      cleanupTokenOnClose();
    }
  }
  sessionStorage.removeItem('isPageRefresh');
};

export const cleanupTokenOnClose = () => {
  clearToken();
  if (serverCheckInterval) {
    clearInterval(serverCheckInterval);
  }
};

export const markNavigatingToLandingPage = () => {
  isNavigatingToLandingPage = true;
};

export const resetNavigatingFlag = () => {
  isNavigatingToLandingPage = false;
};

export const setToken = (token) => {
  const tokenData = {
    value: token,
    timestamp: new Date().getTime(),
    expiresIn: 86400000, // 24 hours
  };
  localStorage.setItem('jwtToken', JSON.stringify(tokenData));
  setupTokenCleanup();
};

export const getToken = () => {
  const tokenData = localStorage.getItem('jwtToken');
  if (!tokenData) return null;

  try {
    const { value, timestamp, expiresIn } = JSON.parse(tokenData);
    const now = new Date().getTime();

    if (now - timestamp > expiresIn) {
      clearToken();
      return null;
    }

    return value;
  } catch {
    clearToken();
    return null;
  }
};

export const clearToken = () => {
  localStorage.removeItem('jwtToken');
  // Clear the interval when token is cleared
  if (serverCheckInterval) {
    clearInterval(serverCheckInterval);
  }
};

// Detect refresh
window.addEventListener('load', () => {
  sessionStorage.setItem('isPageRefresh', 'true');
  // Check if there's a token and start monitoring if there is
  const token = localStorage.getItem('jwtToken');
  if (token) {
    setupTokenCleanup();
  }
});