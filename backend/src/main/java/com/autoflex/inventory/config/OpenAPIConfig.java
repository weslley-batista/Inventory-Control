package com.autoflex.inventory.config;

import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.info.Contact;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.info.License;
import org.eclipse.microprofile.openapi.annotations.servers.Server;

import jakarta.ws.rs.core.Application;

@OpenAPIDefinition(
    info = @Info(
        title = "Sistema de Controle de Estoque API",
        version = "1.0.0",
        description = "API REST para controle de estoque de produtos e matérias-primas. " +
                     "Permite gerenciar produtos, matérias-primas e suas associações, " +
                     "além de calcular sugestões de produção baseadas no estoque disponível.",
        contact = @Contact(
            name = "Autoflex",
            email = "contato@autoflex.com"
        ),
        license = @License(
            name = "Proprietary"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080",
            description = "Servidor de Desenvolvimento"
        )
    }
)
public class OpenAPIConfig extends Application {
}

