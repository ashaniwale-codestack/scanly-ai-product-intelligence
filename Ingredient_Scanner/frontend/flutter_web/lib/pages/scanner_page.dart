import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import '../services/product_api.dart';

class ScannerPage extends StatefulWidget {
  @override
  State<ScannerPage> createState() => _ScannerPageState();
}

class _ScannerPageState extends State<ScannerPage> {
  late InAppWebViewController controller;
  String barcode = "";
  Map<String, dynamic>? product;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Scan a Product")),
      body: Column(
        children: [
          Expanded(
            child: InAppWebView(
              onWebViewCreated: (c) {
                controller = c;

                c.addJavaScriptHandler(
                  handlerName: "onBarcodeScanned",
                  callback: (args) async {
                    barcode = args[0];
                    product = await ProductAPI.fetchProduct(barcode);
                    setState(() {});
                    return null;
                  },
                );

                c.loadHtml(
                  """
                  <video id="videoPreview" style="width:100%;height:100%;"></video>
                  <script src="scanner.js"></script>
                  <script>
                      startScanner('onBarcodeScanned');
                  </script>
                  """,
                );
              },
            ),
          ),

          if (product != null)
            Padding(
              padding: EdgeInsets.all(16),
              child: Text(product.toString()),
            )
        ],
      ),
    );
  }
}
