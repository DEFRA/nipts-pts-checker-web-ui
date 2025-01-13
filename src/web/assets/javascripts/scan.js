class QRScanner {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.checkCameraPermissions();
    this.cameraInitialized = false;
  }

  initializeElements() {
    this.cameraAccessPrompt = document.getElementById("camera-access-prompt");
    this.cameraAccessDenied = document.getElementById("camera-access-denied");
    this.qrReader = document.getElementById("qr-reader");
    this.allowCameraAccessButton = document.getElementById(
      "allow-camera-access"
    );
    this.toggleFlashButton = document.getElementById("toggle-flash");
    this.flashButtonContainer = document.querySelector(".flash-button");
    this.qrScanner = null;
    this.flashOn = false;
  }

  initializeEventListeners() {
    if (this.allowCameraAccessButton) {
      this.allowCameraAccessButton.addEventListener("click", async () => {
        await this.requestCameraAccess();
      });
    }

    if (this.toggleFlashButton) {
      this.toggleFlashButton.addEventListener("click", () => {
        this.toggleFlash();
      });
    }
  }

  async checkCameraPermissions() {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissions = await navigator.permissions.query({
          name: "camera",
        });
        if (permissions.state === "granted") {
          await this.startCamera();
        } else if (permissions.state === "denied") {
          this.showCameraDenied();
        } else {
          this.showCameraPrompt();
        }

        permissions.addEventListener("change", async (e) => {
          if (e.target.state === "granted") {
            await this.startCamera();
          } else {
            this.showCameraDenied();
          }
        });
      } else {
        await this.startCamera();
      }
    } catch (error) {
      this.showCameraPrompt();
    }
  }

  async requestCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      if (error.name === "NotAllowedError") {
        this.showCameraPrompt();
      } else {
        this.showCameraDenied();
      }
    }
  }

  getQrBoxSize() {
    const qrReader = document.getElementById("qr-reader");
    const containerWidth = qrReader.offsetWidth;

    const qrBoxSize = Math.floor(containerWidth * 0.7);

    return {
      width: qrBoxSize,
      height: qrBoxSize,
    };
  }

  async startCamera() {
    if (this.cameraInitialized) return;

    try {
      await this.stopScanner();
      this.showScanner();

      this.qrScanner = new Html5Qrcode("qr-reader");
      const qrReader = document.getElementById("qr-reader");
      const containerWidth = qrReader.offsetWidth;

      const qrBoxSize = this.getQrBoxSize();

      await this.qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: qrBoxSize,
          aspectRatio: 1.0,
          width: containerWidth,
          height: containerWidth,
        },
        this.handleQRCodeSuccess.bind(this),
        (errorMessage) => {}
      );
      window.addEventListener("resize", () => {
        if (this.qrScanner && this.qrScanner.isScanning) {
          const newQrBoxSize = this.getQrBoxSize();
          this.qrScanner.applyVideoConstraints({
            width: newQrBoxSize.width,
            height: newQrBoxSize.height,
          });
        }
      });

      this.cameraInitialized = true;
      this.flashButtonContainer.style.display = "block";
      this.removeRequestButton();
    } catch (error) {
      this.showCameraDenied();
    }
  }

  toggleFlash() {
    this.flashOn = !this.flashOn;
    this.toggleFlashButton.textContent = this.flashOn
      ? "Turn flash off"
      : "Turn flash on";
  }

  async handleQRCodeSuccess(decodedText) {
    try {
      await this.stopScanner();

      const response = await fetch("/checker/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCodeData: decodedText }),
      });

      window.location.href = response.url;
    } catch (error) {
      window.location.href = "/checker/scan";
    }
  }

  removeRequestButton() {
    const elementsToRemove = [
      "qr-reader__dashboard_section_csr",
      "qr-reader__dashboard_section_swaplink",
      "qr-reader__dashboard_section",
    ];

    elementsToRemove.forEach((className) => {
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
      } catch (error) {}
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
      this.qrReader.innerHTML = "";
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
}

document.addEventListener("DOMContentLoaded", () => {
  new QRScanner();
});
