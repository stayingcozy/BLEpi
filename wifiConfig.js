const fs = require('fs');
const { exec } = require('child_process');

function writeWifiCredentials(wifiNetwork) {

// Create the content for the wpa_supplicant.conf file
const wpaConfigContent = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
    ssid="${wifiNetwork.ssid}"
    psk="${wifiNetwork.psk}"
    key_mgmt=${wifiNetwork.key_mgmt}
}
`; 

// Define the file path for wpa_supplicant.conf
const wpaConfigFilePath = '/etc/wpa_supplicant/wpa_supplicant.conf';

// Write the content to the file
fs.writeFile(wpaConfigFilePath, wpaConfigContent, (err) => {
    if (err) {
    console.error('Error writing wpa_supplicant.conf:', err);
    } else {
    console.log('wpa_supplicant.conf file created/updated successfully!');
    restartWifiInterface()
    }
});
}

function restartWifiInterface() {
//   exec('sudo ip link set wlan0 down', (err, stdout, stderr) => {
//     if (err) {
//       console.error(`Error stopping WiFi interface: ${err}`);
//       return;
//     }

//     exec('sudo ip link set wlan0 up', (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error starting WiFi interface: ${err}`);
//         return;
//       }

//       console.log('WiFi interface restarted successfully!');
//     });
//   });
  // Bring the interface down
  exec('ip link set eth0 down', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error while bringing the interface down: ${error.message}`);
      return;
    }

    // Add a _ second delay
    setTimeout(() => {
      // Bring the interface back up
      exec('ip link set eth0 up', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error while bringing the interface up: ${error.message}`);
          return;
        }
        console.log('Network interface restarted successfully.');
      });
    }, 3000);
  });
}

module.exports = { writeWifiCredentials };
