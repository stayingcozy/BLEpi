const bleno = require('bleno');

import { writeWifiCredentials } from './wifiConfig';

const myCameraTowerServiceUuid = 'fb0af608-c3ad-41bb-9aba-6d8185f45de7';
// const helloCharacteristicUuid = 'c8659212-af91-4ad3-a995-a58d6fd26145';
const writeCharacteristicUuid = '0cb87266-9c1e-4e8b-a317-b742364e03b4';

// const helloCharacteristic = new bleno.Characteristic({
//   uuid: helloCharacteristicUuid,
//   properties: ['read'],
//   value: Buffer.from('Hello from Raspberry Pi'),
// });

const wifiCredentials = {
  ssid: '',
  psk: '',
  key_mgmt: 'WPA-PSK',
};

const writeCharacteristic = new bleno.Characteristic({
  uuid: writeCharacteristicUuid,
  properties: ['write'],
  // onWriteRequest: (data, offset, withoutResponse, callback) => {
  //   // Handle the data received from the web app
  //   const receivedMessage = data.toString('utf-8');
  //   console.log('Received message:', receivedMessage);

  //   // You can now process the receivedMessage (e.g., configure Wi-Fi settings)

  //   // Send a response back to the web app (optional)
  //   const response = 'Message received by Raspberry Pi';
  //   callback(bleno.Characteristic.RESULT_SUCCESS, Buffer.from(response, 'utf-8'));
  // },
  onWriteRequest: (data, offset, withoutResponse, callback) => {
    // Handle the data received from the web app
    const receivedMessage = data.toString('utf-8').split(':');
    wifiCredentials.ssid = receivedMessage[0];
    wifiCredentials.psk = receivedMessage[1];
    console.log('Received message:', wifiCredentials);

    // Process the receivedMessage (e.g., configure Wi-Fi settings)
    // and restart pi for settings to take hold and connect
    writeWifiCredentials(wifiCredentials);

    // Send a response back to the web app (optional)
    const response = 'Message received by Raspberry Pi';
    callback(bleno.Characteristic.RESULT_SUCCESS, Buffer.from(response, 'utf-8'));
  },
});

const myCameraTowerService = new bleno.PrimaryService({
  uuid: myCameraTowerServiceUuid,
  characteristics: [writeCharacteristic], //helloCharacteristicUuid
});

bleno.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    bleno.startAdvertising('MyCameraTower', [myCameraTowerServiceUuid]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', (error) => {
  if (!error) {
    console.log('Advertising as MyCameraTower');
    bleno.setServices([myCameraTowerService]);
  } else {
    console.error('Error starting advertising:', error);
  }
});

bleno.on('accept', (clientAddress) => {
  console.log('Accepted connection from:', clientAddress);
});

bleno.on('disconnect', (clientAddress) => {
  console.log('Disconnected from:', clientAddress);
});
