describe('Product Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/products', { fixture: 'products.json' }).as('getProducts');
    cy.intercept('GET', '**/api/raw-materials', { fixture: 'rawMaterials.json' }).as('getRawMaterials');
    cy.intercept('POST', '**/api/products', { statusCode: 201, body: { id: 3, code: 'PROD003', name: 'New Product', value: 100.0 } }).as('createProduct');
    cy.intercept('PUT', '**/api/products/*', { statusCode: 200, body: { id: 1, code: 'PROD001', name: 'Updated Product', value: 150.0 } }).as('updateProduct');
    cy.intercept('DELETE', '**/api/products/*', { statusCode: 204 }).as('deleteProduct');
    cy.intercept('GET', '**/api/products/*/raw-materials', { statusCode: 200, body: [] }).as('getProductRawMaterials');
  });

  it('should display products list', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Product Management').should('be.visible');
    cy.contains('PROD001').should('be.visible');
    cy.contains('Product 1').should('be.visible');
    cy.contains('PROD002').should('be.visible');
  });

  it('should display empty state when no products', () => {
    cy.intercept('GET', '**/api/products', { statusCode: 200, body: [] }).as('getEmptyProducts');
    cy.visit('/products');
    cy.wait('@getEmptyProducts');
    cy.contains('No products found').should('be.visible');
  });

  it('should open add product modal', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Add Product').click();
    cy.contains('Add Product').should('be.visible');
    cy.get('input[type="text"]').first().should('be.visible');
    cy.get('input[type="text"]').eq(1).should('be.visible');
    cy.get('input[type="number"]').should('be.visible');
  });

  it('should create a new product', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Add Product').click();
    
    cy.get('input[type="text"]').eq(0).type('PROD003');
    cy.get('input[type="text"]').eq(1).type('New Product');
    cy.get('input[type="number"]').type('100.00');
    
    cy.intercept('GET', '**/api/products', {
      statusCode: 200,
      body: [
        { id: 1, code: 'PROD001', name: 'Product 1', value: 100.0 },
        { id: 2, code: 'PROD002', name: 'Product 2', value: 200.0 },
        { id: 3, code: 'PROD003', name: 'New Product', value: 100.0 }
      ]
    }).as('getUpdatedProducts');
    
    cy.contains('Create').click();
    
    cy.wait('@createProduct');
    cy.wait('@getUpdatedProducts');
    cy.contains('PROD003').should('be.visible');
  });

  it('should validate required fields when creating product', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Add Product').click();
    
    cy.contains('Create').click();
    
    cy.get('input[type="text"]').first().should('have.attr', 'required');
  });

  it('should edit a product', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Edit').first().click();
    
    cy.contains('Edit Product').should('be.visible');
    cy.get('input[type="text"]').eq(1).clear().type('Updated Product');
    cy.get('input[type="number"]').clear().type('150.00');
    
    cy.intercept('GET', '**/api/products', {
      statusCode: 200,
      body: [
        { id: 1, code: 'PROD001', name: 'Updated Product', value: 150.0 },
        { id: 2, code: 'PROD002', name: 'Product 2', value: 200.0 }
      ]
    }).as('getUpdatedProducts');
    
    cy.contains('Update').click();
    
    cy.wait('@updateProduct');
    cy.wait('@getUpdatedProducts');
    cy.contains('Updated Product').should('be.visible');
  });

  it('should cancel edit modal', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Edit').first().click();
    cy.contains('Cancel').click();
    cy.contains('Edit Product').should('not.exist');
  });

  it('should delete a product', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Delete').first().click();
    cy.on('window:confirm', () => true);
    cy.wait('@deleteProduct');
    cy.wait('@getProducts');
  });

  it('should cancel delete confirmation', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    const initialProductCount = cy.contains('PROD001');
    cy.contains('Delete').first().click();
    cy.on('window:confirm', () => false);
    initialProductCount.should('be.visible');
  });

  it('should display product associations', () => {
    cy.intercept('GET', '**/api/products/1/raw-materials', {
      statusCode: 200,
      body: [
        { id: 1, rawMaterialId: 1, rawMaterialCode: 'RM001', rawMaterialName: 'Raw Material 1', requiredQuantity: 5 }
      ]
    }).as('getAssociations');
    
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Associations').first().click();
    cy.wait('@getAssociations');
    cy.contains('Raw Material Associations').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/products', { statusCode: 500, body: { message: 'Server Error' } }).as('getProductsError');
    cy.visit('/products');
    cy.wait('@getProductsError');
    cy.get('body').should('contain.text', 'Error');
  });
});
