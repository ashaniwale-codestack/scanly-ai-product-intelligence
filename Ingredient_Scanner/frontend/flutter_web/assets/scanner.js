async function startScanner() {
  const devices = await codeReader.listVideoInputDevices();
  const deviceId = devices[0].deviceId;

  const constraints = {
    video: {
      deviceId: deviceId,
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: "environment"
    }
  };

  // Get stream manually with constraints
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const videoElement = document.getElementById('videoPreview');
  videoElement.srcObject = stream;
  videoElement.play();

  let lastDecodeTime = 0;
  const decodeInterval = 300; // ms

  // Use decodeFromVideoElement to decode frames from your video element
  codeReader.decodeFromVideoElement(videoElement, (result, err) => {
    const now = Date.now();
    if (now - lastDecodeTime < decodeInterval) {
      return; // throttle decoding
    }
    lastDecodeTime = now;

    if (result) {
      // Your barcode processing code here
    }
    if (err && !(err instanceof ZXing.NotFoundException)) {
      console.error(err);
    }
  });
}
