const fs = require('fs');

function writeWifiCredentials(wifiNetwork) {
    
    // Create the content for the wpa_supplicant.conf file
    const wpaConfigContent = `
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
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
        restartWiFiInterface()
        }
    });
}

function restartWiFiInterface() {
  const { exec } = require('child_process');
  exec('sudo ifdown wlan0 && sudo ifup wlan0', (err, stdout, stderr) => {
    if (err) {
      console.error('Error restarting WiFi interface:', err);
    } else {
      console.log('WiFi interface restarted');
    }
  });
}

module.exports = { writeWifiCredentials };
