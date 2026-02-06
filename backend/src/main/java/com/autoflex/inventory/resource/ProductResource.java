package com.autoflex.inventory.resource;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import com.autoflex.inventory.service.ProductService;
import com.autoflex.inventory.service.ProductRawMaterialService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @Inject
    ProductService productService;

    @Inject
    ProductRawMaterialService productRawMaterialService;

    @GET
    public Response findAll() {
        try {
            List<ProductDTO> products = productService.findAll();
            return Response.ok(products).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching products: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        try {
            ProductDTO product = productService.findById(id);
            return Response.ok(product).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching product: " + e.getMessage()).build();
        }
    }

    @POST
    public Response create(@Valid ProductDTO dto) {
        try {
            ProductDTO created = productService.create(dto);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating product: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductDTO dto) {
        try {
            ProductDTO updated = productService.update(id, dto);
            return Response.ok(updated).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating product: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        try {
            productService.delete(id);
            return Response.noContent().build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting product: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{productId}/raw-materials")
    public Response getRawMaterialsByProductId(@PathParam("productId") Long productId) {
        try {
            List<ProductRawMaterialDTO> associations = productRawMaterialService.findByProductId(productId);
            return Response.ok(associations).build();
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Product not found")) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(e.getMessage()).build();
            }
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching associations: " + e.getMessage()).build();
        }
    }

    @POST
    @Path("/{productId}/raw-materials")
    public Response createRawMaterialAssociation(@PathParam("productId") Long productId, @Valid ProductRawMaterialDTO dto) {
        try {
            ProductRawMaterialDTO created = productRawMaterialService.create(productId, dto);
            return Response.status(Response.Status.CREATED).entity(created).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error creating association: " + e.getMessage()).build();
        }
    }

}

