import React, { useState, useRef } from 'react';
import './App.css';
import data from './data';

import {
  Container,
  InputGroup, DropdownButton, Dropdown,
  Row, Col, Card, Form,
  Button, Modal,
  Table, Image,
  Fade, Alert,
  Pagination, ToastContainer, Toast
} from 'react-bootstrap';
import { BsSearch, BsFillFileEarmarkPlusFill, BsPencilFill, BsFillTrashFill, BsUpload, BsArrowUp, BsArrowDown } from "react-icons/bs";

function App() {
  const [items, setItems] = useState(data.items);
  const [filteredItems, setFilteredItems] = useState(data.items);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [initItemName, setInitItemName] = useState('');
  const [isInputItemNameValid, setIsInputItemNameValid] = useState(true);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const inputFile = useRef(null);
  const [isUploadFileTypeValid, setIsUploadFileTypeValid] = useState(true);
  const [isUploadFileSizeValid, setIsUploadFileSizeValid] = useState(true);
  const [inputSearch, setInputSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPageSelection = [5, 10, 15, 20];
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageSelection[1]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [toastState, setToastState] = useState({ show: false });
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sortedData = [...filteredItems].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setFilteredItems(sortedData);
    setSortConfig({ key, direction });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredItems.length;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const onFormModalHide = () => {
    setShowFormModal(false);
    setIsInputItemNameValid(true);
  }
  const validateItemName = (value) => {
    value = value.trim().toLowerCase();
    if (items.find(x => x.name.trim().toLowerCase() === value)) {
      if (selectedItem) {
        if (initItemName === value) {
          setIsInputItemNameValid(true);
        }
        else
          setIsInputItemNameValid(false);
      }
      else if (initItemName === value && selectedItem) {
        setIsInputItemNameValid(false);
      }
    }
    else
      setIsInputItemNameValid(true);
  };

  return (
    <div className="App">
      <ToastContainer className="p-3" position="top-end">
        <Toast show={toastState.show} delay={3000} bg={toastState.variant} autohide onClose={() => setToastState({ show: false })}>
          <Toast.Header closeButton={false}>
            <strong>{toastState.title}</strong>
          </Toast.Header>
          <Toast.Body className={toastState.variant === "success" ? "text-white" : "text-black"}>{toastState.message}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Container>
        <Card className="mt-5">
          <Card.Header><h3>Data Barang</h3></Card.Header>
          <Card.Body>
            <Row>
              <Col xl={6} lg={6} md={12} sm={12} xs={12} className="mt-2 text-start">
                <InputGroup>
                  <span className="input-group-text bg-transparent"><BsSearch /></span>
                  <Form.Control placeholder="Cari nama barang..." value={inputSearch} onInput={(e) => {
                    setInputSearch(e.target.value);
                    setCurrentPage(1);
                    setFilteredItems(items.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase())));
                  }} />
                </InputGroup>
              </Col>
              <Col xl={6} lg={6} md={12} sm={12} xs={12} className="mt-2 text-end">
                <Button variant="primary" onClick={() => {
                  setInitItemName('');
                  setIsUploadFileSizeValid(true);
                  setIsUploadFileTypeValid(true);
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
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Nama Barang {(sortConfig.key === 'name' ?
                      sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown /> : null)}
                  </th>
                  <th onClick={() => handleSort('purchasePrice')} style={{ cursor: 'pointer' }}>
                    Harga Beli {(sortConfig.key === 'purchasePrice' ?
                      sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown /> : null)}
                  </th>
                  <th onClick={() => handleSort('sellingPrice')} style={{ cursor: 'pointer' }}>
                    Harga Jual {(sortConfig.key === 'sellingPrice' ?
                      sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown /> : null)}
                  </th>
                  <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                    Stok {(sortConfig.key === 'stock' ?
                      sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown /> : null)}
                  </th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {
                  currentItems.map((item, idx) => {
                    return (
                      <tr key={'tableRow-' + idx}>
                        <td className="text-start">{item.name}</td>
                        <td>{item.purchasePrice.toLocaleString()}</td>
                        <td>{item.sellingPrice.toLocaleString()}</td>
                        <td>{item.stock.toLocaleString()}</td>
                        <td>
                          <div className='d-flex text-center'>
                            <Button variant="outline-primary" size="sm" onClick={() => {
                              setIsUploadFileSizeValid(true);
                              setIsUploadFileTypeValid(true);
                              var selected = items.find(x => x.id === item.id);
                              setInitItemName(selected.name.trim().toLowerCase());
                              setSelectedItem(selected);
                              setShowFormModal(true);
                            }}>
                              <BsPencilFill />
                            </Button>
                            <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => {
                              var selected = items.find(x => x.id === item.id);
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
            <Pagination className="float-end">
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => handlePagination(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
              <Dropdown>
                <Dropdown.Toggle variant="light" className="ms-1">
                  {itemsPerPage}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: "inherit" }} as="div" >
                  {itemsPerPageSelection.map((x, idx) => (
                    <Dropdown.Item key={"page-select-" + idx} value={x} active={x === itemsPerPage} onClick={(e) => setItemsPerPage(Number(e.target.text))}>{x}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Pagination>
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
              <Form.Label htmlFor="item-purchasePrice">Foto Barang</Form.Label>
              <Form.Control type="file" accept='.jpg, .png' ref={inputFile} className="d-none" onChange={(e) => {
                var fileToUpload = e.target && e.target.files ? e.target.files[0] : null;
                var isFileValid = false;
                if (fileToUpload) {
                  if (fileToUpload.size <= (100 * 1024)) {
                    setIsUploadFileSizeValid(true);
                    isFileValid = true;
                  }
                  else {
                    setIsUploadFileSizeValid(false);
                  }
                }
                else {
                  setIsUploadFileSizeValid(true);
                }

                if (fileToUpload) {
                  if (fileToUpload.type === "image/jpg" || fileToUpload.type === "image/png") {
                    setIsUploadFileTypeValid(true);
                    isFileValid = true;
                  }
                  else {
                    setIsUploadFileTypeValid(false);
                  }
                }
                else {
                  setIsUploadFileTypeValid(true);
                }

                if (isFileValid) {
                  setSelectedItem({
                    ...selectedItem,
                    imageUrl: URL.createObjectURL(fileToUpload)
                  });
                }
              }} />
              <div id="item-purchasePrice" >
                <Button type="button" onClick={() => inputFile.current.click()} >Upload &nbsp; <BsUpload /></Button>
              </div>
              <Form.Text muted>
                Format foto barang yang diizinkan hanya JPG dan PNG, dan ukurannya maksimal 100KB
              </Form.Text>
            </Form.Group>
            <Fade in={!isUploadFileSizeValid}>
              <Alert variant="danger" className={(!isUploadFileSizeValid ? "d-block" : "d-none") + " text-danger p-2"}>
                Foto yang anda pilih ukurannya lebih dari 100KB
              </Alert>
            </Fade>
            <Fade in={!isUploadFileTypeValid}>
              <Alert variant="danger" className={(!isUploadFileSizeValid ? "d-block" : "d-none") + " text-danger p-2"}>
                Format foto barang yang diizinkan hanya JPG dan PNG
              </Alert>
            </Fade>
            {selectedItem.imageUrl ? <Image alt="preview image" src={selectedItem.imageUrl} rounded width={400} /> : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onFormModalHide}>
            Tutup
          </Button>
          <Button variant="primary" onClick={() => {
            setShowFormModal(false);

            setToastState({
              show: true,
              title: "Information",
              message: "Data berhasil disimpan.",
              variant: "success"
            })
          }}>
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
            setToastState({
              show: true,
              title: "Information",
              message: "Data berhasil dihapus.",
              variant: "success"
            })
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
