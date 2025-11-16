let codeReader = null;
let lastBarcode = null;
let lastScanTime = 0; // debounce timer

// Start the scanner
async function startScanner(flutterCallback) {
    try {
        // Use BrowserMultiFormatReader for all common 1D/2D formats
        const hints = new Map();
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
            ZXing.BarcodeFormat.QR_CODE,
            ZXing.BarcodeFormat.CODE_128,
            ZXing.BarcodeFormat.CODE_39,
            ZXing.BarcodeFormat.EAN_13,
            ZXing.BarcodeFormat.EAN_8,
            ZXing.BarcodeFormat.UPC_A,
            ZXing.BarcodeFormat.UPC_E,
            ZXing.BarcodeFormat.DATA_MATRIX,
            ZXing.BarcodeFormat.PDF_417
        ]);

        codeReader = new ZXing.BrowserMultiFormatReader(hints);

        // Get available video devices
        const devices = await codeReader.listVideoInputDevices();
        if (devices.length === 0) {
            console.error("No camera devices found");
            return;
        }

        // Use the first rear-facing camera if possible
        const constraints = {
            video: {
                deviceId: devices[0].deviceId,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "environment" // rear camera on mobile
            }
        };

        codeReader.decodeFromConstraints(
            constraints,
            'videoPreview',
            (result, err) => {
                if (result) {
                    const barcode = result.text;
                    const now = Date.now();

                    // Debounce: only send if barcode changed or 1.5s passed
                    if (barcode !== lastBarcode || now - lastScanTime > 1500) {
                        lastBarcode = barcode;
                        lastScanTime = now;

                        const lang = document.getElementById("langSelect").value;

                        // Fetch product data in selected language
                        fetchProductInLanguage(barcode, lang);

                        // Send barcode to Flutter
                        if (window.flutter_inappwebview) {
                            window.flutter_inappwebview.callHandler(flutterCallback, barcode);
                        }

                        console.log("Scanned barcode:", barcode);
                    }
                }

                if (err && !(err instanceof ZXing.NotFoundException)) {
                    console.error("ZXing scan error:", err);
                }
            }
        );
    } catch (e) {
        console.error("Error starting scanner:", e);
    }
}

// Stop the scanner
function stopScanner() {
    if (codeReader) {
        codeReader.reset();
        codeReader = null;
        lastBarcode = null;
        lastScanTime = 0;
    }
}

// Fetch product info from backend
async function fetchProductInLanguage(barcode, lang) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/product/${encodeURIComponent(barcode)}?lang=${lang}`);
        if (!response.ok) throw new Error("Network response not OK");

        const data = await response.json();

        // Send translated product data to Flutter
        if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('onProductFetched', data);
        }
    } catch (err) {
        console.error("Error fetching product:", err);
    }
}

// Handle language change
window.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById("langSelect");
    langSelect.addEventListener("change", () => {
        const lang = langSelect.value;
        if (lastBarcode) {
            fetchProductInLanguage(lastBarcode, lang);
        }
    });
});
