# local-upload-server

Seamlessly transfer files between computers and mobile devices over your local network.

<img width="892" height="702" alt="image" src="https://github.com/user-attachments/assets/675c645c-c593-437d-a493-01461bd5fa00" />

## Features

- **Upload multiple files at once**
- **Individual progress bars for each file**
- **Instant upload feedback (success/failure)**
- **Modern, responsive UI**
- **Secure file handling on server**

## Description

This project is a Node.js-based file upload server with a modern web interface. Users can select and upload multiple files simultaneously, with each file showing its own progress bar. The server provides instant feedback for each upload, ensuring a smooth and transparent user experience. All files are handled securely on the backend.

## Usage

1. Start the server: `node server.js`
2. Open your browser and navigate to `http://localhost:8000` (replace PORT with your configured port if different).
3. Use the web interface to select and upload files.

## Transferring Files from Another Computer

1. Launch the application on the destination PC or server.
2. Obtain the IPv4 address of the destination machine. (use commands `ipconfig` for windows or `ifconfig getifaddr en0` for mac)
3. On the source PC, open a web browser and navigate to `http://<IPv4_address>:<port>` (e.g. `192.168.1.5:8000`).
4. Verify uploaded files on destination PC. Yay!

## Disclaimer

This software is provided for educational and personal use only. Use it at your own discretion. The author is not responsible for any misuse. All responsibility for the use of this software lies solely with the user.

---

Made with ❤️ by [HariKishorePec](https://github.com/HariKishorePec)
