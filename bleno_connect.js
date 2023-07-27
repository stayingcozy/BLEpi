const bleno = require('bleno');

const myCameraTowerServiceUuid = 'd804b643-6ce7-4e81-9f8a-ce0f699085eb';
const helloCharacteristicUuid = 'c8659212-af91-4ad3-a995-a58d6fd26145';
const writeCharacteristicUuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

const helloCharacteristic = new bleno.Characteristic({
  uuid: helloCharacteristicUuid,
  properties: ['read'],
  value: Buffer.from('Hello from Raspberry Pi'),
});

const writeCharacteristic = new bleno.Characteristic({
  uuid: writeCharacteristicUuid,
  properties: ['write'],
  onWriteRequest: (data, offset, withoutResponse, callback) => {
    // Handle the data received from the web app
    const receivedMessage = data.toString('utf-8');
    console.log('Received message:', receivedMessage);

    // You can now process the receivedMessage (e.g., configure Wi-Fi settings)

    // Send a response back to the web app (optional)
    const response = 'Message received by Raspberry Pi';
    callback(bleno.Characteristic.RESULT_SUCCESS, Buffer.from(response, 'utf-8'));
  },
});

const myCameraTowerService = new bleno.PrimaryService({
  uuid: myCameraTowerServiceUuid,
  characteristics: [helloCharacteristic, writeCharacteristic],
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
