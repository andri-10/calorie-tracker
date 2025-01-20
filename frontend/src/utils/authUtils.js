let isNavigatingToLandingPage = false;
let serverCheckInterval = null;
let lastSuccessfulCheck = Date.now();

export const setupTokenCleanup = () => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  startServerCheck();

  
  checkServerStatus();
};

const checkServerStatus = async () => {
  try {

    const backendResponse = await fetch('http://localhost:8080/users/health', {
      method: 'HEAD',
      timeout: 5000 // 5 second timeout
    });
    
    if (!backendResponse.ok) {
      handleServerDown('Backend server is down');
      return;
    }


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

    handleServerDown(error.message);
  }
};

const startServerCheck = () => {
  if (serverCheckInterval) {
    clearInterval(serverCheckInterval);
  }


  serverCheckInterval = setInterval(checkServerStatus, 5000);
};

const handleServerDown = (reason) => {
  console.log('Server down detected:', reason);
  const timeSinceLastCheck = Date.now() - lastSuccessfulCheck;
  

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

  if (serverCheckInterval) {
    clearInterval(serverCheckInterval);
  }
};


window.addEventListener('load', () => {
  sessionStorage.setItem('isPageRefresh', 'true');

  const token = localStorage.getItem('jwtToken');
  if (token) {
    setupTokenCleanup();
  }
});