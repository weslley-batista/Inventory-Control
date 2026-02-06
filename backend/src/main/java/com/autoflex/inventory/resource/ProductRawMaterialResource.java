package com.autoflex.inventory.resource;

import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import com.autoflex.inventory.service.ProductRawMaterialService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRawMaterialResource {

    @Inject
    ProductRawMaterialService productRawMaterialService;

    @GET
    @Path("/product-raw-materials/{id}")
    public Response findById(@PathParam("id") Long id) {
        try {
            ProductRawMaterialDTO association = productRawMaterialService.findById(id);
            return Response.ok(association).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error fetching association: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/product-raw-materials/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductRawMaterialDTO dto) {
        try {
            ProductRawMaterialDTO updated = productRawMaterialService.update(id, dto);
            return Response.ok(updated).build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error updating association: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/product-raw-materials/{id}")
    public Response delete(@PathParam("id") Long id) {
        try {
            productRawMaterialService.delete(id);
            return Response.noContent().build();
        } catch (RuntimeException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(e.getMessage()).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error deleting association: " + e.getMessage()).build();
        }
    }

}

