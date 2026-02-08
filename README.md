# Sistema de Controle de Estoque

Sistema completo de controle de estoque desenvolvido para uma indústria que produz produtos diversos, permitindo o controle de produtos, matérias-primas e a associação entre eles.

## Arquitetura

O sistema foi desenvolvido seguindo arquitetura de API REST, separando completamente back-end e front-end:

- **Back-end**: Quarkus (Java) com Hibernate Panache e RESTEasy Reactive
- **Front-end**: React com Redux Toolkit
- **Banco de Dados**: Oracle (com suporte para PostgreSQL e MySQL)
- **Testes**: JUnit 5 (back-end), Jest e Cypress (front-end)

## Estrutura do Projeto

```
projeto/
├── backend/          # Quarkus API
│   ├── src/main/java/com/autoflex/inventory/
│   │   ├── entity/          # Entidades JPA
│   │   ├── repository/      # Repositórios Panache
│   │   ├── service/         # Lógica de negócio
│   │   ├── resource/        # Controllers REST
│   │   └── dto/             # Data Transfer Objects
│   └── src/test/java/       # Testes
├── frontend/         # React + Redux
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── store/           # Redux store e slices
│   │   └── services/        # API calls
│   └── cypress/             # Testes E2E
└── README.md
```

## Pré-requisitos

- Java 17 ou superior
- Maven 3.8+
- Node.js 18+ e npm
- Oracle Database (ou PostgreSQL/MySQL)
- Git

## Configuração do Back-end

### 1. Configurar Banco de Dados

Edite o arquivo `backend/src/main/resources/application.properties` com as credenciais do seu banco Oracle:

```properties
quarkus.datasource.username=seu_usuario
quarkus.datasource.password=sua_senha
quarkus.datasource.jdbc.url=jdbc:oracle:thin:@localhost:1521:XE
```

### 2. Executar o Back-end

```bash
cd backend
./mvnw quarkus:dev
```

O servidor estará disponível em `http://localhost:8080`

### 3. Documentação da API (Swagger)

Após iniciar o servidor, a documentação interativa da API estará disponível em:

- **Swagger UI**: `http://localhost:8080/swagger-ui`
- **OpenAPI JSON**: `http://localhost:8080/openapi`

A documentação inclui todos os endpoints da API com exemplos de requisições e respostas.

### 4. Executar Testes do Back-end

```bash
cd backend
./mvnw test
```

## Configuração do Front-end

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar URL da API

Crie um arquivo `.env` na pasta `frontend/`:

```env
REACT_APP_API_URL=http://localhost:8080
```

### 3. Executar o Front-end

```bash
cd frontend
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### 4. Executar Testes do Front-end

**Testes Unitários:**
```bash
cd frontend
npm test
```

**Testes E2E (Cypress):**
```bash
cd frontend
npm run cypress:open
```

## Funcionalidades

### RF001 - CRUD de Produtos
- Criar, listar, atualizar e excluir produtos
- Campos: código, nome e valor

### RF002 - CRUD de Matérias-Primas
- Criar, listar, atualizar e excluir matérias-primas
- Campos: código, nome e quantidade em estoque

### RF003 - Associação Produto-Matéria-Prima
- Associar matérias-primas aos produtos
- Definir quantidade necessária de cada matéria-prima por produto
- Interface integrada ao cadastro de produtos

### RF004 - Sugestões de Produção
- Calcular produtos produzíveis com base no estoque disponível
- Priorização por valor (produtos de maior valor primeiro)
- Cálculo de quantidade máxima produzível
- Valor total da produção sugerida

## Endpoints da API

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/{id}` - Buscar produto por ID
- `POST /api/products` - Criar produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Excluir produto

### Matérias-Primas
- `GET /api/raw-materials` - Listar todas as matérias-primas
- `GET /api/raw-materials/{id}` - Buscar matéria-prima por ID
- `POST /api/raw-materials` - Criar matéria-prima
- `PUT /api/raw-materials/{id}` - Atualizar matéria-prima
- `DELETE /api/raw-materials/{id}` - Excluir matéria-prima

### Associações
- `GET /api/products/{productId}/raw-materials` - Listar matérias-primas de um produto
- `POST /api/products/{productId}/raw-materials` - Associar matéria-prima a produto
- `PUT /api/product-raw-materials/{id}` - Atualizar associação
- `DELETE /api/product-raw-materials/{id}` - Remover associação

### Produção
- `GET /api/production/suggestions` - Obter sugestões de produção

## Tecnologias Utilizadas

### Back-end
- Quarkus 3.6.0
- Hibernate ORM with Panache
- RESTEasy Reactive
- SmallRye OpenAPI (Swagger)
- Oracle JDBC Driver
- JUnit 5
- REST Assured

### Front-end
- React 18
- Redux Toolkit
- React Router
- Axios
- Bootstrap 5
- Jest + React Testing Library
- Cypress

## Testes

### Back-end
- Testes unitários para Services
- Testes de integração para Resources usando `@QuarkusTest`

### Front-end
- Testes unitários com Jest e React Testing Library
- Testes E2E com Cypress cobrindo fluxos principais
