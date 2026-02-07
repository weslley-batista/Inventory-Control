import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import {
  Table, Button, Modal, Form, Alert, Card, Row, Col
} from 'react-bootstrap';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  clearError,
} from '../store/slices/rawMaterialsSlice';
import { useAppDispatch, useAppSelector } from '../store';
import { RawMaterial, RawMaterialFormData } from '../types';

const RawMaterialManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: rawMaterials, loading, error } = useAppSelector((state) => state.rawMaterials);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRawMaterial, setEditingRawMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState<RawMaterialFormData>({
    code: '',
    name: '',
    stockQuantity: '',
  });

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleOpenModal = (rawMaterial: RawMaterial | null = null) => {
    if (rawMaterial) {
      setEditingRawMaterial(rawMaterial);
      setFormData({
        code: rawMaterial.code,
        name: rawMaterial.name,
        stockQuantity: rawMaterial.stockQuantity.toString(),
      });
    } else {
      setEditingRawMaterial(null);
      setFormData({ code: '', name: '', stockQuantity: '' });
    }
    setShowModal(true);
    dispatch(clearError());
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRawMaterial(null);
    setFormData({ code: '', name: '', stockQuantity: '' });
    dispatch(clearError());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const rawMaterialData = {
        code: formData.code,
        name: formData.name,
        stockQuantity: parseInt(formData.stockQuantity, 10),
      };

      if (editingRawMaterial) {
        await dispatch(updateRawMaterial({
          id: editingRawMaterial.id,
          rawMaterial: rawMaterialData,
        })).unwrap();
      } else {
        await dispatch(createRawMaterial(rawMaterialData)).unwrap();
      }
      handleCloseModal();
      dispatch(fetchRawMaterials());
    } catch (err) {
      console.error('Error saving raw material:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this raw material?')) {
      try {
        await dispatch(deleteRawMaterial(id)).unwrap();
        dispatch(fetchRawMaterials());
      } catch (err) {
        console.error('Error deleting raw material:', err);
      }
    }
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h2>Raw Material Management</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add Raw Material
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
                  <th>Stock Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center">Loading...</td>
                  </tr>
                ) : rawMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No raw materials found</td>
                  </tr>
                ) : (
                  rawMaterials.map((rawMaterial) => (
                    <tr key={rawMaterial.id}>
                      <td>{rawMaterial.code}</td>
                      <td>{rawMaterial.name}</td>
                      <td>{rawMaterial.stockQuantity}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleOpenModal(rawMaterial)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(rawMaterial.id)}
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
          <Modal.Title>
            {editingRawMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert variant="danger" onClose={() => dispatch(clearError())} dismissible className="mb-3">
                {error}
              </Alert>
            )}
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
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                step="1"
                min="0"
                value={formData.stockQuantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingRawMaterial ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default RawMaterialManagement;

