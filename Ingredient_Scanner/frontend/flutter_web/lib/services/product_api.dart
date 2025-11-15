import 'dart:convert';
import 'package:http/http.dart' as http;

class ProductAPI {
  static const String baseUrl = "http://localhost:8000"; // Your FastAPI backend

  static Future<Map<String, dynamic>?> fetchProduct(String barcode) async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/product/$barcode"));
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return null;
    } catch (e) {
      print("Error fetching product: $e");
      return null;
    }
  }
}
