const { exec } = require('child_process');
const { isContext } = require('vm');

function wifiCheck() {
    // Check wifi status
    const command = 'iwconfig wlan0 | grep "ESSID"';
  
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error while executing command: ${error.message}`);
        return 0;
      }
  
      const output = stdout.toString();

      if (output.includes('ESSID:off/any')) {
        isConnected = false;
      }
      else {
        isConnected = true;
      }
      
      // Update your boolean value based on the WiFi connection status
      if (isConnected) {
        // WiFi is connected
        // Update your boolean value here
        console.log('WiFi is connected.');
        return 1;
      } else {
        // WiFi is not connected
        // Update your boolean value here
        console.log('WiFi is not connected.');
        return 0;
      }
    });
  }
  
  module.exports = { wifiCheck };