import { BleManager, type Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

export const manager = new BleManager();

export const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
    return (
      granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_SCAN"] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_CONNECT"] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const scanForPeripherals = (
  onDeviceFound: (device: Device) => void,
) => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      return;
    }
    if (device && (device.name || device.localName)) {
      onDeviceFound(device);
    }
  });
};

export const stopScan = () => {
  manager.stopDeviceScan();
};

export const connectToDevice = async (deviceId: string) => {
  try {
    const device = await manager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    return device;
  } catch (error) {
    throw new Error(`Connection failed: ${error}`);
  }
};

export const printData = async (
  device: Device,
  data: string,
  serviceUuid: string,
  characteristicUuid: string,
) => {
  try {
    await device.writeCharacteristicWithResponseForService(
      serviceUuid,
      characteristicUuid,
      data,
    );
  } catch (error) {
    throw new Error(`Print failed: ${error}`);
  }
};
