import React, { useState } from 'react';
import './App.css';
import data from './data';

import { Container, InputGroup, Row, Col, Card, Form, Button, Modal, Table, Image, Fade, Alert } from 'react-bootstrap';
import { BsSearch, BsFillFileEarmarkPlusFill, BsPencilFill, BsFillTrashFill } from "react-icons/bs";

function App() {
  var [items, setItems] = useState(data.items);
  var [filteredItems, setFilteredItems] = useState(data.items);
  var [showFormModal, setShowFormModal] = useState(false);
  var [selectedItem, setSelectedItem] = useState({});
  var [initItemName, setInitItemName] = useState('');
  var [isInputItemNameValid, setIsInputItemNameValid] = useState(true);
  var [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  var [isUploadFileSizeValid, setIsUploadFileSizeValid] = useState(true);
  var [inputSearch, setInputSearch] = useState('');

  const onFormModalHide = () => {
    setShowFormModal(false);
    setIsInputItemNameValid(true);
  }
  const validateItemName = (value) => {
    value = value.trim().toLowerCase();
    if (items.find(x => x.name.trim().toLowerCase() == value)) {
      if (selectedItem) {
        if (initItemName == value) {
          setIsInputItemNameValid(true);
        }
        else
          setIsInputItemNameValid(false);
      }
      else if (initItemName == value && selectedItem) {
        setIsInputItemNameValid(false);
      }
    }
    else
      setIsInputItemNameValid(true);
  };

  return (
    <div className="App">
      <Container>
        <Card className="mt-5">
          <Card.Header><h3>Data Barang</h3></Card.Header>
          <Card.Body>
            <Row>
              <Col className="text-start">
                <InputGroup>
                  <Form.Control placeholder="Cari nama barang..." value={inputSearch} onInput={(e) => {
                    setInputSearch(e.target.value);
                    setFilteredItems(items.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase())));
                  }} />
                  <Button type="button" width={300}>Cari &nbsp; <BsSearch /></Button>
                </InputGroup>
              </Col>
              <Col className="text-end">
                <Button variant="primary" onClick={() => {
                  setInitItemName('');
                  setIsUploadFileSizeValid(true);
                  setSelectedItem({});
                  setShowFormModal(true);
                }}>
                  Tambah &nbsp;<BsFillFileEarmarkPlusFill />
                </Button>
              </Col>
            </Row>
            <Table striped>
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Harga Beli</th>
                  <th>Harga Jual</th>
                  <th>Stok</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredItems.map((item, idx) => {
                    return (
                      <tr key={'tableRow-' + idx}>
                        <td className="text-start">{item.name}</td>
                        <td>{item.purchasePrice}</td>
                        <td>{item.sellingPrice}</td>
                        <td>{item.stock}</td>
                        <td>
                          <div className='d-flex text-center'>
                            <Button variant="outline-primary" size="sm" onClick={() => {
                              setIsUploadFileSizeValid(true);
                              var selected = items.find(x => x.id == item.id);
                              setInitItemName(selected.name.trim().toLowerCase());
                              setSelectedItem(selected);
                              setShowFormModal(true);
                            }}>
                              <BsPencilFill />
                            </Button>
                            <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => {
                              var selected = items.find(x => x.id == item.id);
                              setSelectedItem(selected);
                              setShowDeleteConfirmationModal(true)
                            }}>
                              <BsFillTrashFill />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      <Modal show={showFormModal} onHide={onFormModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem.id > 0 ? "Edit" : "Tambah"} Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="item-name">Nama Barang</Form.Label>
              <Form.Control id="item-name" type="text" value={selectedItem.name} onInput={(e) => {
                validateItemName(e.target.value);
                setSelectedItem({
                  ...selectedItem,
                  name: e.target.value
                });
              }} />
              <Form.Text className={(!isInputItemNameValid ? "d-inline-block" : "d-none") + " text-danger"}>
                Mohon maaf, barang dengan nama ini sudah ada.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="item-purchasePrice">Harga Beli</Form.Label>
              <Form.Control id="item-purchasePrice" type="number" value={selectedItem.purchasePrice} onChange={(e) => {
                setSelectedItem({
                  ...selectedItem,
                  purchasePrice: e.target.value
                });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="item-sellingPrice">Harga Jual</Form.Label>
              <Form.Control id="item-sellingPrice" type="number" value={selectedItem.sellingPrice} onChange={(e) => {
                setSelectedItem({
                  ...selectedItem,
                  sellingPrice: e.target.value
                });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="item-stock">Stok</Form.Label>
              <Form.Control id="item-stock" type="number" value={selectedItem.stock} onChange={(e) => {
                setSelectedItem({
                  ...selectedItem,
                  stock: e.target.value
                });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="item-purchasePrice">Foto</Form.Label>
              <Form.Control id="item-purchasePrice" type="file" accept='.jpg, .png' onChange={(e) => {
                if (e.target && e.target.files) {
                  if (e.target.files[0].size <= (100 * 1024)) {
                    setIsUploadFileSizeValid(true);
                    setSelectedItem({
                      ...selectedItem,
                      imageUrl: URL.createObjectURL(e.target.files[0])
                    });
                  }
                  else {
                    setIsUploadFileSizeValid(false);
                  }
                }
                else {
                  setIsUploadFileSizeValid(true);
                }
              }} />
              <Form.Text muted>
                Format foto barang yang diizinkan hanya JPG dan PNG, dan ukurannya maksimal 100KB
              </Form.Text>
            </Form.Group>
            <Fade in={!isUploadFileSizeValid}>
              <Alert variant="danger" className={(!isUploadFileSizeValid ? "d-block" : "d-none") + " text-danger"}>
                Foto yang anda pilih ukurannya lebih dari 100KB
              </Alert>
            </Fade>
            {selectedItem.imageUrl ? <Image alt="preview image" src={selectedItem.imageUrl} rounded width={400} /> : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onFormModalHide}>
            Tutup
          </Button>
          <Button variant="primary" onClick={() => setShowFormModal(false)}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah anda yakin untuk menghapus data '{selectedItem.name}'?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => {
            setShowDeleteConfirmationModal(false);
          }}>
            Ya
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
            Tidak
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
