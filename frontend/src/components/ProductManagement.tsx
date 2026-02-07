import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import {
  Table, Button, Modal, Form, Alert, Card, Row, Col
} from 'react-bootstrap';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
} from '../store/slices/productsSlice';
import {
  fetchProductRawMaterials,
  createProductRawMaterial,
  deleteProductRawMaterial,
  clearItems,
} from '../store/slices/productRawMaterialsSlice';
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { Product, ProductFormData, AssociationFormData } from '../types';

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);
  const { items: rawMaterials } = useAppSelector((state) => state.rawMaterials);
  const { items: associations } = useAppSelector((state) => state.productRawMaterials);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAssociationModal, setShowAssociationModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    code: '',
    name: '',
    value: '',
  });
  const [associationForm, setAssociationForm] = useState<AssociationFormData>({
    rawMaterialId: '',
    requiredQuantity: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProductId) {
      dispatch(fetchProductRawMaterials(selectedProductId));
    }
  }, [dispatch, selectedProductId]);

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        code: product.code,
        name: product.name,
        value: product.value.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({ code: '', name: '', value: '' });
    }
    setShowModal(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ code: '', name: '', value: '' });
    dispatch(clearError());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const productData = {
        code: formData.code,
        name: formData.name,
        value: parseFloat(formData.value),
      };

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, product: productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      handleCloseModal();
      dispatch(fetchProducts());
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        dispatch(fetchProducts());
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleOpenAssociationModal = (productId: number) => {
    setSelectedProductId(productId);
    setAssociationForm({ rawMaterialId: '', requiredQuantity: '' });
    setShowAssociationModal(true);
    dispatch(clearItems());
    dispatch(fetchProductRawMaterials(productId));
  };

  const handleCloseAssociationModal = () => {
    setShowAssociationModal(false);
    setSelectedProductId(null);
    setAssociationForm({ rawMaterialId: '', requiredQuantity: '' });
    dispatch(clearItems());
  };

  const handleAddAssociation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId) return;
    try {
      await dispatch(createProductRawMaterial({
        productId: selectedProductId,
        association: {
          rawMaterialId: parseInt(associationForm.rawMaterialId),
          requiredQuantity: parseInt(associationForm.requiredQuantity, 10),
        },
      })).unwrap();
      setAssociationForm({ rawMaterialId: '', requiredQuantity: '' });
      dispatch(fetchProductRawMaterials(selectedProductId));
    } catch (err) {
      console.error('Error adding association:', err);
    }
  };

  const handleDeleteAssociation = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this association?')) {
      try {
        await dispatch(deleteProductRawMaterial(id)).unwrap();
        if (selectedProductId) {
          dispatch(fetchProductRawMaterials(selectedProductId));
        }
      } catch (err) {
        console.error('Error deleting association:', err);
      }
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h2>Product Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add Product
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
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">Loading...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No products found</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.code}</td>
                      <td>{product.name}</td>
                      <td>${product.value.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleOpenModal(product)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenAssociationModal(product.id)}
                          className="me-2"
                        >
                          Associations
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                value={formData.code}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                value={formData.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, value: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showAssociationModal} onHide={handleCloseAssociationModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Raw Material Associations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAssociation} className="mb-4">
            <Row>
              <Col md={5}>
                <Form.Select
                  value={associationForm.rawMaterialId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setAssociationForm({ ...associationForm, rawMaterialId: e.target.value })}
                  required
                >
                  <option value="">Select Raw Material</option>
                  {rawMaterials.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.code} - {rm.name} (Stock: {rm.stockQuantity})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  step="1"
                  min="1"
                  placeholder="Required Quantity"
                  value={associationForm.requiredQuantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAssociationForm({ ...associationForm, requiredQuantity: e.target.value })}
                  required
                />
              </Col>
              <Col md={3}>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Col>
            </Row>
          </Form>

          <div className="table-responsive">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Raw Material</th>
                  <th>Required Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {associations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">No associations</td>
                  </tr>
                ) : (
                  associations.map((assoc) => (
                    <tr key={assoc.id}>
                      <td>{assoc.rawMaterialName}</td>
                      <td>{assoc.requiredQuantity}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAssociation(assoc.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssociationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;

