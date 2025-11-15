import 'dart:convert';
import 'package:http/http.dart' as http;

class ProductAPI {
  static Future<Map<String, dynamic>> fetchProduct(String barcode) async {
    final res = await http.get(
      Uri.parse("http://localhost:8000/product/$barcode"),
    );
    return json.decode(res.body);
  }
}
