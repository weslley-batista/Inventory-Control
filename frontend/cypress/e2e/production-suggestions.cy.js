describe('Production Suggestions', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/production/suggestions', {
      statusCode: 200,
      body: {
        products: [
          {
            productId: 1,
            productCode: 'PROD001',
            productName: 'Product 1',
            productValue: 100.0,
            producibleQuantity: 10,
            totalValue: 1000.0,
          },
          {
            productId: 2,
            productCode: 'PROD002',
            productName: 'Product 2',
            productValue: 200.0,
            producibleQuantity: 5,
            totalValue: 1000.0,
          },
        ],
        totalValue: 2000.0,
      },
    }).as('getSuggestions');
  });

  it('should display production suggestions', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    cy.contains('Production Suggestions').should('be.visible');
    cy.contains('PROD001').should('be.visible');
    cy.contains('Product 1').should('be.visible');
    cy.contains('PROD002').should('be.visible');
    cy.contains('Product 2').should('be.visible');
  });

  it('should display product details correctly', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    
    cy.contains('PROD001').should('be.visible');
    cy.contains('Product 1').should('be.visible');
    cy.contains('$100.00').should('be.visible');
    cy.contains('10').should('be.visible');
    cy.contains('$1,000.00').should('be.visible');
    
    cy.contains('PROD002').should('be.visible');
    cy.contains('Product 2').should('be.visible');
    cy.contains('$200.00').should('be.visible');
    cy.contains('5').should('be.visible');
  });

  it('should display total production value', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    cy.contains('Total Production Value').should('be.visible');
    cy.contains('$2,000.00').should('be.visible');
  });

  it('should display empty state when no products can be produced', () => {
    cy.intercept('GET', '**/api/production/suggestions', {
      statusCode: 200,
      body: {
        products: [],
        totalValue: 0.0,
      },
    }).as('getEmptySuggestions');
    
    cy.visit('/production');
    cy.wait('@getEmptySuggestions');
    cy.contains('No products can be produced with the current raw material stock').should('be.visible');
  });

  it('should refresh suggestions', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    cy.contains('Refresh').click();
    cy.wait('@getSuggestions');
    cy.contains('PROD001').should('be.visible');
  });

  it('should display loading state', () => {
    cy.intercept('GET', '**/api/production/suggestions', {
      delay: 500,
      statusCode: 200,
      body: {
        products: [
          {
            productId: 1,
            productCode: 'PROD001',
            productName: 'Product 1',
            productValue: 100.0,
            producibleQuantity: 10,
            totalValue: 1000.0,
          },
        ],
        totalValue: 1000.0,
      },
    }).as('getSuggestionsDelayed');
    
    cy.visit('/production');
    cy.get('.spinner-border').should('be.visible');
    cy.wait('@getSuggestionsDelayed');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/production/suggestions', { statusCode: 500, body: { message: 'Server Error' } }).as('getSuggestionsError');
    cy.visit('/production');
    cy.wait('@getSuggestionsError');
    cy.get('body').should('contain.text', 'Error');
  });

  it('should display description text', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    cy.contains('Products are prioritized by value').should('be.visible');
    cy.contains('The system calculates the maximum producible quantity').should('be.visible');
  });

  it('should format currency correctly', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    
    cy.contains('$100.00').should('be.visible');
    cy.contains('$200.00').should('be.visible');
    cy.contains('$1,000.00').should('be.visible');
    cy.contains('$2,000.00').should('be.visible');
  });

  it('should display producible quantity as strong text', () => {
    cy.visit('/production');
    cy.wait('@getSuggestions');
    
    cy.get('strong').contains('10').should('exist');
    cy.get('strong').contains('5').should('exist');
  });
});
