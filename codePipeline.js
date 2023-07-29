const sudo = require('sudo-prompt');
const { wifiCheck } = require('./wifiStatus');

// Main script
wifiCheck((result) => {

  if (result === 1) {
    // WiFi is connected, run the Go program (main)
    const { spawn } = require('child_process');
    const mainProcess = spawn('./main', [], {
      stdio: 'inherit',
    });

    mainProcess.on('close', (code) => {
      console.log(`Main process exited with code ${code}`);
    });
  } else {
    // WiFi is not connected, run the Node.js BLE script with sudo
    const options = {
      name: 'MyApp', // Provide your app name or identifier here
    };
    sudo.exec('node ble-script.js', options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error while executing BLE script with sudo: ${error.message}`);
        return;
      }
      console.log(`BLE script output: ${stdout}`);
      // When the BLE script exits, start the main Go program
      const { spawn } = require('child_process');
      const mainProcess = spawn('./main', [], {
        stdio: 'inherit',
      });

      mainProcess.on('close', (code) => {
        console.log(`Main process exited with code ${code}`);
      });
    });
  }
  
});
