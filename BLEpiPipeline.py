import os
import subprocess
import platform


def main():

    print("Running BLEpi")

    # WiFi is not connected, run the Node.js BLE script with sudo
    blepi_path = os.path.join(os.path.dirname(__file__), "bleno_connect.js")
    subprocess.run(["sudo", "node", blepi_path], text=True, capture_output=True)


if __name__ == "__main__":
    main()
