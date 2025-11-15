let codeReader = null;

async function startScanner(callbackName) {
  codeReader = new ZXing.BrowserBarcodeReader();

  const devices = await ZXing.BrowserBarcodeReader.listVideoInputDevices();

  codeReader.decodeFromVideoDevice(
    devices[0].deviceId,
    'videoPreview',
    (result, err) => {
      if (result) {
        window.flutter_inappwebview.callHandler(callbackName, result.text);
      }
    }
  );
}

function stopScanner() {
  if (codeReader) codeReader.reset();
}
