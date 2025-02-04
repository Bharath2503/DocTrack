import React, { useState, useRef } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { FaDeleteLeft } from "react-icons/fa6";
import "./DocumentList.css"; // Import the new CSS file

function DocumentList({ applicantId, applicants, setApplicants }) {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null); // Track selected document for details
  const fileInputRef = useRef(null);

  const applicant = applicants.find((app) => app.id === applicantId);

  // Add a new document
  const handleAddDocument = (e) => {
    e.preventDefault();

    if (documentName.trim() !== "") {
      const newDocument = {
        id: Date.now(),
        name: documentName,
        files: [], // Initially, no files
      };

      const updatedApplicants = applicants.map((app) =>
        app.id === applicantId
          ? { ...app, documents: [...app.documents, newDocument] }
          : app
      );

      setApplicants(updatedApplicants);
      setDocumentName(""); // Clear input
    }
  };

  // Add file to an existing document
  const handleAddFileToDocument = (docId) => {
    if (file) {
      const updatedApplicants = applicants.map((app) =>
        app.id === applicantId
          ? {
              ...app,
              documents: app.documents.map((doc) =>
                doc.id === docId
                  ? {
                      ...doc,
                      files: [
                        ...doc.files,
                        {
                          id: Date.now(),
                          name: file.name,
                          url: URL.createObjectURL(file),
                        },
                      ],
                    }
                  : doc
              ),
            }
          : app
      );

      setApplicants(updatedApplicants);
      setFile(null); // Reset file input
      fileInputRef.current.value = ""; // Reset file input field
    }
  };

  // Delete a file from a document
  const handleDeleteFile = (docId, fileId) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId
        ? {
            ...app,
            documents: app.documents.map((doc) =>
              doc.id === docId
                ? { ...doc, files: doc.files.filter((f) => f.id !== fileId) }
                : doc
            ),
          }
        : app
    );

    setApplicants(updatedApplicants);
  };

  // Delete a document
  const handleDeleteDocument = (docId) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId
        ? { ...app, documents: app.documents.filter((doc) => doc.id !== docId) }
        : app
    );

    setApplicants(updatedApplicants);
  };

  return (
    <div className="document-section">
      <h3>Documents for {applicant.name}</h3>

      {/* Add Document Form */}
      <Form onSubmit={handleAddDocument}>
        <Row className=" m-3 justify-content-center">
          <Col xs="auto" className="mt-3">
            <Form.Group>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter Document Name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="mt-3">
            <Button type="submit" size="sm">
              + Add Document
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Document List in a Single Row */}
      <div className="document-list">
        {applicant?.documents.length === 0 ? (
          <p>No documents added.</p>
        ) : (
          applicant.documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <Button
                variant={
                  selectedDocument === doc.id ? "primary" : "outline-primary"
                }
                size="sm"
                onClick={() =>
                  setSelectedDocument(
                    selectedDocument === doc.id ? null : doc.id
                  )
                }
              >
                {doc.name}
              </Button>

              {/* Delete Document Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteDocument(doc.id)}
              >
                <FaDeleteLeft />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Selected Document Details Section */}
      {selectedDocument && (
        <div className="selected-document">
          <h5>
            Files for{" "}
            {
              applicant.documents.find((doc) => doc.id === selectedDocument)
                ?.name
            }
          </h5>

          {applicant.documents.find((doc) => doc.id === selectedDocument)?.files
            .length === 0 ? (
            <p>No files uploaded for this document.</p>
          ) : (
            <Table striped bordered size="sm" className="table-file-list">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applicant.documents
                  .find((doc) => doc.id === selectedDocument)
                  ?.files.map((file) => (
                    <tr key={file.id}>
                      <td>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.name}
                        </a>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteFile(selectedDocument, file.id)
                          }
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}

          {/* File upload for the selected document */}
          <Form.Group>
            <Form.Control
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
          <Button
            size="sm"
            onClick={() => handleAddFileToDocument(selectedDocument)}
          >
            + Add File
          </Button>
        </div>
      )}
    </div>
  );
}

export default DocumentList;
