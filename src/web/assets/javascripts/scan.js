class QRScanner {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.checkCameraPermissions();
  }

  initializeElements() {
    this.cameraAccessPrompt = document.getElementById("camera-access-prompt");
    this.cameraAccessDenied = document.getElementById("camera-access-denied");
    this.qrReader = document.getElementById("qr-reader");
    this.allowCameraAccessButton = document.getElementById("allow-camera-access");
    this.qrScanner = null;
  }

  initializeEventListeners() {
    if (this.allowCameraAccessButton) {
      this.allowCameraAccessButton.addEventListener("click", async () => {
        await this.requestCameraAccess();
      });
    }
  }

  async checkCameraPermissions() {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' });
      
      if (permissions.state === 'granted') {
        await this.startCamera();
      } else if (permissions.state === 'denied') {
        this.showCameraDenied();
      } else {
        this.showCameraPrompt();
      }

      permissions.addEventListener('change', async (e) => {
        if (e.target.state === 'granted') {
          await this.startCamera();
        } else {
          this.showCameraDenied();
        }
      });
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      this.showCameraPrompt();
    }
  }

  async requestCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }
      });
      
      // Stop the temporary stream
      stream.getTracks().forEach(track => track.stop());
      
      // Start the actual QR scanner
      await this.startCamera();
    } catch (error) {
      console.error("Camera access denied:", error);
      this.showCameraDenied();
    }
  }

  async startCamera() {
    try {
      // Clean up existing scanner if any
      await this.stopScanner();

      // Show the scanner container first
      this.showScanner();

      // Create new Html5Qrcode instance
      this.qrScanner = new Html5Qrcode("qr-reader");

      await this.qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        this.handleQRCodeSuccess.bind(this),
        (errorMessage) => console.log("QR scan error:", errorMessage)
      );

      // Remove any request button elements that might be created
      this.removeRequestButton();

    } catch (error) {
      console.error("Error starting camera:", error);
      this.showCameraDenied();
    }
  }

  removeRequestButton() {
    // Remove any HTML5QRCode internal elements we don't want
    const elementsToRemove = [
      'qr-reader__dashboard_section_csr',
      'qr-reader__dashboard_section_swaplink',
      'qr-reader__dashboard_section'
    ];

    elementsToRemove.forEach(className => {
      const elements = document.getElementsByClassName(className);
      while (elements.length > 0) {
        elements[0].remove();
      }
    });
  }

  async stopScanner() {
    if (this.qrScanner && this.qrScanner.isScanning) {
      try {
        await this.qrScanner.stop();
        this.qrScanner.clear();
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  }

  showScanner() {
    if (this.cameraAccessPrompt) {
      this.cameraAccessPrompt.style.display = "none";
    }
    if (this.cameraAccessDenied) {
      this.cameraAccessDenied.style.display = "none";
    }
    if (this.qrReader) {
      this.qrReader.style.display = "block";
      this.qrReader.innerHTML = '';
    }
  }

  showCameraDenied() {
    if (this.cameraAccessPrompt) {
      this.cameraAccessPrompt.style.display = "none";
    }
    if (this.cameraAccessDenied) {
      this.cameraAccessDenied.style.display = "block";
    }
    if (this.qrReader) {
      this.qrReader.style.display = "none";
    }
  }

  showCameraPrompt() {
    if (this.cameraAccessPrompt) {
      this.cameraAccessPrompt.style.display = "block";
    }
    if (this.cameraAccessDenied) {
      this.cameraAccessDenied.style.display = "none";
    }
    if (this.qrReader) {
      this.qrReader.style.display = "none";
    }
  }

  async handleQRCodeSuccess(decodedText) {
    try {
      // Stop scanning once we get a result
      await this.stopScanner();

      const response = await fetch("/checker/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCodeData: decodedText }),
      });

      if (response.ok) {
        window.location.href = "/checker/dashboard";
      } else {
        console.error("Server response not OK:", response.status);
      }
    } catch (error) {
      console.error("Error submitting QR code data:", error);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new QRScanner();
});