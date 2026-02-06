package com.autoflex.inventory.resource;

import com.autoflex.inventory.dto.ProductionSuggestionDTO;
import com.autoflex.inventory.service.ProductionService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@ApplicationScoped
@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @Inject
    ProductionService productionService;

    @GET
    @Path("/suggestions")
    public Response getProductionSuggestions() {
        try {
            ProductionSuggestionDTO suggestions = productionService.calculateProductionSuggestions();
            return Response.ok(suggestions).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error calculating production suggestions: " + e.getMessage()).build();
        }
    }

}

