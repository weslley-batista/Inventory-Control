import React, { useEffect } from 'react';
import {
  Table, Button, Alert, Card, Row, Col, Badge
} from 'react-bootstrap';
import {
  fetchProductionSuggestions,
  clearError,
} from '../store/slices/productionSlice';
import { useAppDispatch, useAppSelector } from '../store';

const ProductionSuggestions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { suggestions, loading, error } = useAppSelector((state) => state.production);

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProductionSuggestions());
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h2>Production Suggestions</h2>
          <p className="text-muted">
            Products are prioritized by value. The system calculates the maximum producible quantity
            based on available raw materials.
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !suggestions || !suggestions.products || suggestions.products.length === 0 ? (
            <Alert variant="info">
              No products can be produced with the current raw material stock.
            </Alert>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Unit Value</th>
                      <th>Producible Quantity</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestions.products.map((product) => (
                      <tr key={product.productId}>
                        <td>
                          <Badge bg="secondary">{product.productCode}</Badge>
                        </td>
                        <td>{product.productName}</td>
                        <td>{formatCurrency(product.productValue)}</td>
                        <td>
                          <strong>{product.producibleQuantity}</strong>
                        </td>
                        <td>
                          <strong className="text-success">
                            {formatCurrency(product.totalValue)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-info">
                      <td colSpan={4} className="text-end">
                        <strong>Total Production Value:</strong>
                      </td>
                      <td>
                        <strong className="text-success fs-5">
                          {formatCurrency(suggestions.totalValue)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductionSuggestions;

