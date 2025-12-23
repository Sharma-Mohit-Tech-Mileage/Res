import NetInfo from '@react-native-community/netinfo';

class NetworkManager {
  static instance = null;
  
  static getInstance() {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }
  
  /**
   * Check if device has internet connectivity
   * @returns {Promise<{isConnected: boolean, type: string, isInternetReachable: boolean}>}
   */
  async checkConnectivity() {
    try {
      const state = await NetInfo.fetch();
      return {
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      };
    } catch (error) {
      console.error('Error checking connectivity:', error);
      return {
        isConnected: false,
        type: 'unknown',
        isInternetReachable: false,
      };
    }
  }
  
  /**
   * Wait for connectivity with timeout
   * @param {number} timeout - Maximum wait time in ms
   * @returns {Promise<boolean>}
   */
  async waitForConnectivity(timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const { isConnected, isInternetReachable } = await this.checkConnectivity();
      
      if (isConnected && isInternetReachable !== false) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return false;
  }
  
  /**
   * Subscribe to network state changes
   */
  subscribeToNetworkChanges(callback) {
    return NetInfo.addEventListener(state => {
      callback({
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });
  }
}

export default NetworkManager;
