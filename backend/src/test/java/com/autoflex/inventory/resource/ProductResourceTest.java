package com.autoflex.inventory.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
class ProductResourceTest {

    @Test
    void testCreateProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String productJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Test Product\",\n" +
            "    \"value\": \"100.00\"\n" +
            "}", uniqueCode);

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201)
            .body("code", equalTo(uniqueCode))
            .body("name", equalTo("Test Product"))
            .body("value", equalTo(100.0f));
    }

    @Test
    void testGetAllProducts() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String productJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Test Product 2\",\n" +
            "    \"value\": \"200.00\"\n" +
            "}", uniqueCode);

        given()
            .contentType(ContentType.JSON)
            .body(productJson)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201);

        given()
        .when()
            .get("/api/products")
        .then()
            .statusCode(200)
            .body("$", notNullValue());
    }

    @Test
    void testGetProductById() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String productJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Test Product 3\",\n" +
            "    \"value\": \"300.00\"\n" +
            "}", uniqueCode);

        Integer productIdInt = given()
            .contentType(ContentType.JSON)
            .body(productJson)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201)
            .extract()
            .path("id");
        
        Long productId = productIdInt.longValue();

        given()
        .when()
            .get("/api/products/" + productId)
        .then()
            .statusCode(200)
            .body("id", equalTo(productIdInt))
            .body("code", equalTo(uniqueCode));
    }

    @Test
    void testUpdateProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String productJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Test Product 4\",\n" +
            "    \"value\": \"400.00\"\n" +
            "}", uniqueCode);

        Integer productIdInt = given()
            .contentType(ContentType.JSON)
            .body(productJson)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201)
            .extract()
            .path("id");
        
        Long productId = productIdInt.longValue();

        String updateJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Updated Product 4\",\n" +
            "    \"value\": \"450.00\"\n" +
            "}", uniqueCode);

        given()
            .contentType(ContentType.JSON)
            .body(updateJson)
        .when()
            .put("/api/products/" + productId)
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Product 4"))
            .body("value", equalTo(450.0f));
    }

    @Test
    void testDeleteProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String productJson = String.format(
            "{\n" +
            "    \"code\": \"%s\",\n" +
            "    \"name\": \"Test Product 5\",\n" +
            "    \"value\": \"500.00\"\n" +
            "}", uniqueCode);

        Integer productIdInt = given()
            .contentType(ContentType.JSON)
            .body(productJson)
        .when()
            .post("/api/products")
        .then()
            .statusCode(201)
            .extract()
            .path("id");
        
        Long productId = productIdInt.longValue();

        given()
        .when()
            .delete("/api/products/" + productId)
        .then()
            .statusCode(204);

        given()
        .when()
            .get("/api/products/" + productId)
        .then()
            .statusCode(404);
    }
}

