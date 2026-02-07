describe('Raw Material Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/raw-materials', { fixture: 'rawMaterials.json' }).as('getRawMaterials');
    cy.intercept('POST', '**/api/raw-materials', { statusCode: 201, body: { id: 3, code: 'RM003', name: 'New Raw Material', stockQuantity: 75 } }).as('createRawMaterial');
    cy.intercept('PUT', '**/api/raw-materials/*', { statusCode: 200, body: { id: 1, code: 'RM001', name: 'Updated Raw Material', stockQuantity: 150 } }).as('updateRawMaterial');
    cy.intercept('DELETE', '**/api/raw-materials/*', { statusCode: 204 }).as('deleteRawMaterial');
  });

  it('should display raw materials list', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Raw Material Management').should('be.visible');
    cy.contains('RM001').should('be.visible');
    cy.contains('Raw Material 1').should('be.visible');
    cy.contains('RM002').should('be.visible');
    cy.contains('100').should('be.visible');
  });

  it('should display empty state when no raw materials', () => {
    cy.intercept('GET', '**/api/raw-materials', { statusCode: 200, body: [] }).as('getEmptyRawMaterials');
    cy.visit('/raw-materials');
    cy.wait('@getEmptyRawMaterials');
    cy.contains('No raw materials found').should('be.visible');
  });

  it('should open add raw material modal', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Add Raw Material').click();
    cy.contains('Add Raw Material').should('be.visible');
    cy.get('input[type="text"]').should('have.length', 2);
    cy.get('input[type="number"]').should('be.visible');
  });

  it('should create a new raw material', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Add Raw Material').click();
    
    cy.get('input[type="text"]').eq(0).type('RM003');
    cy.get('input[type="text"]').eq(1).type('New Raw Material');
    cy.get('input[type="number"]').type('75');
    
    cy.intercept('GET', '**/api/raw-materials', {
      statusCode: 200,
      body: [
        { id: 1, code: 'RM001', name: 'Raw Material 1', stockQuantity: 100 },
        { id: 2, code: 'RM002', name: 'Raw Material 2', stockQuantity: 50 },
        { id: 3, code: 'RM003', name: 'New Raw Material', stockQuantity: 75 }
      ]
    }).as('getUpdatedRawMaterials');
    
    cy.contains('Create').click();
    
    cy.wait('@createRawMaterial');
    cy.wait('@getUpdatedRawMaterials');
    cy.contains('RM003').should('be.visible');
    cy.contains('New Raw Material').should('be.visible');
  });

  it('should validate required fields when creating raw material', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Add Raw Material').click();
    
    cy.contains('Create').click();
    
    cy.get('input[type="text"]').first().should('have.attr', 'required');
    cy.get('input[type="number"]').should('have.attr', 'required');
  });

  it('should validate numeric input for stock quantity', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Add Raw Material').click();
    
    cy.get('input[type="number"]').should('have.attr', 'type', 'number');
    cy.get('input[type="number"]').should('have.attr', 'min', '0');
  });

  it('should edit a raw material', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Edit').first().click();
    
    cy.contains('Edit Raw Material').should('be.visible');
    cy.get('input[type="text"]').eq(1).clear().type('Updated Raw Material');
    cy.get('input[type="number"]').clear().type('150');
    
    cy.intercept('GET', '**/api/raw-materials', {
      statusCode: 200,
      body: [
        { id: 1, code: 'RM001', name: 'Updated Raw Material', stockQuantity: 150 },
        { id: 2, code: 'RM002', name: 'Raw Material 2', stockQuantity: 50 }
      ]
    }).as('getUpdatedRawMaterials');
    
    cy.contains('Update').click();
    
    cy.wait('@updateRawMaterial');
    cy.wait('@getUpdatedRawMaterials');
    cy.contains('Updated Raw Material').should('be.visible');
    cy.contains('150').should('be.visible');
  });

  it('should cancel edit modal', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Edit').first().click();
    cy.contains('Cancel').click();
    cy.contains('Edit Raw Material').should('not.exist');
  });

  it('should delete a raw material', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Delete').first().click();
    cy.on('window:confirm', () => true);
    cy.wait('@deleteRawMaterial');
    cy.wait('@getRawMaterials');
  });

  it('should cancel delete confirmation', () => {
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    const initialRawMaterial = cy.contains('RM001');
    cy.contains('Delete').first().click();
    cy.on('window:confirm', () => false);
    initialRawMaterial.should('be.visible');
  });

  it('should display loading state', () => {
    cy.intercept('GET', '**/api/raw-materials', {
      delay: 500,
      fixture: 'rawMaterials.json'
    }).as('getRawMaterialsDelayed');
    
    cy.visit('/raw-materials');
    cy.contains('Loading...').should('be.visible');
    cy.wait('@getRawMaterialsDelayed');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/raw-materials', { statusCode: 500, body: { message: 'Server Error' } }).as('getRawMaterialsError');
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterialsError');
    cy.get('body').should('contain.text', 'Error');
  });

  it('should display error message and allow dismissal', () => {
    cy.intercept('POST', '**/api/raw-materials', { statusCode: 400, body: { message: 'Validation Error' } }).as('createRawMaterialError');
    
    cy.visit('/raw-materials');
    cy.wait('@getRawMaterials');
    cy.contains('Add Raw Material').click();
    
    cy.get('input[type="text"]').eq(0).type('RM003');
    cy.get('input[type="text"]').eq(1).type('New Raw Material');
    cy.get('input[type="number"]').type('75');
    cy.contains('Create').click();
    
    cy.wait('@createRawMaterialError');
    cy.get('.modal .alert-danger').should('be.visible');
    cy.get('.modal .alert-danger button').click();
    cy.get('.modal .alert-danger').should('not.exist');
  });
});

