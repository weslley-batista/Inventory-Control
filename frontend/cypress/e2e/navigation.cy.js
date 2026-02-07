describe('Navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/products', { fixture: 'products.json' }).as('getProducts');
    cy.intercept('GET', '**/api/raw-materials', { fixture: 'rawMaterials.json' }).as('getRawMaterials');
    cy.intercept('GET', '**/api/production/suggestions', {
      statusCode: 200,
      body: {
        products: [],
        totalValue: 0.0,
      },
    }).as('getSuggestions');
  });

  it('should navigate to Products page', () => {
    cy.visit('/');
    cy.contains('Products').click();
    cy.url().should('include', '/products');
    cy.wait('@getProducts');
    cy.contains('Product Management').should('be.visible');
  });

  it('should navigate to Raw Materials page', () => {
    cy.visit('/');
    cy.contains('Raw Materials').click();
    cy.url().should('include', '/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Raw Material Management').should('be.visible');
  });

  it('should navigate to Production Suggestions page', () => {
    cy.visit('/');
    cy.contains('Production Suggestions').click();
    cy.url().should('include', '/production');
    cy.wait('@getSuggestions');
    cy.contains('Production Suggestions').should('be.visible');
  });

  it('should display navigation bar on all pages', () => {
    cy.visit('/products');
    cy.contains('Inventory Control').should('be.visible');
    cy.contains('Products').should('be.visible');
    cy.contains('Raw Materials').should('be.visible');
    cy.contains('Production Suggestions').should('be.visible');
  });

  it('should navigate using direct URL', () => {
    cy.visit('/products');
    cy.contains('Product Management').should('be.visible');
    
    cy.visit('/raw-materials');
    cy.contains('Raw Material Management').should('be.visible');
    
    cy.visit('/production');
    cy.contains('Production Suggestions').should('be.visible');
  });

  it('should navigate back and forth between pages', () => {
    cy.visit('/products');
    cy.wait('@getProducts');
    cy.contains('Product Management').should('be.visible');
    
    cy.contains('Raw Materials').click();
    cy.wait('@getRawMaterials');
    cy.contains('Raw Material Management').should('be.visible');
    
    cy.contains('Production Suggestions').click();
    cy.wait('@getSuggestions');
    cy.contains('Production Suggestions').should('be.visible');
    
    cy.contains('Products').click();
    cy.wait('@getProducts');
    cy.contains('Product Management').should('be.visible');
  });

  it('should maintain navigation state when refreshing', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.reload();
    cy.wait('@getRawMaterials');
    cy.contains('Raw Material Management').should('be.visible');
  });

  it('should highlight active navigation link', () => {
    cy.visit('/products');
    cy.get('a[href="/products"]').should('exist');
    
    cy.visit('/raw-materials');
    cy.get('a[href="/raw-materials"]').should('exist');
    
    cy.visit('/production');
    cy.get('a[href="/production"]').should('exist');
  });
});

