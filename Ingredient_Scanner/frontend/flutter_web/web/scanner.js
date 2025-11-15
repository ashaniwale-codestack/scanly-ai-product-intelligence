let codeReader = null;
let lastBarcode = null;

// Start scanner
async function startScanner(flutterCallback) {
    codeReader = new ZXing.BrowserBarcodeReader();

    const devices = await ZXing.BrowserBarcodeReader.listVideoInputDevices();
    if (devices.length === 0) {
        console.error("No camera devices found");
        return;
    }

    codeReader.decodeFromVideoDevice(
        devices[0].deviceId,
        'videoPreview',
        (result, err) => {
            if (result) {
                lastBarcode = result.text; // save globally

                const lang = document.getElementById("langSelect").value;

                // Fetch product in selected language
                fetchProductInLanguage(lastBarcode, lang);

                // Send barcode to Flutter
                window.flutter_inappwebview.callHandler(flutterCallback, lastBarcode);
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        }
    );
}

// Stop scanner
function stopScanner() {
    if (codeReader) codeReader.reset();
}

// Fetch product from backend in selected language
async function fetchProductInLanguage(barcode, lang) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/product/${encodeURIComponent(barcode)}?lang=${lang}`);
        const data = await response.json();
        // Send translated product data to Flutter
        window.flutter_inappwebview.callHandler('onProductFetched', data);
    } catch (err) {
        console.error("Error fetching product:", err);
    }
}

// Attach listener AFTER DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById("langSelect");
    langSelect.addEventListener("change", () => {
        const lang = langSelect.value;
        if (lastBarcode) {
            fetchProductInLanguage(lastBarcode, lang);
        }
    });
});
