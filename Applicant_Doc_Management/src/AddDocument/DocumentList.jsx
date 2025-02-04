import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { FaDeleteLeft } from "react-icons/fa6";
import { Row, Col } from "react-bootstrap";

function DocumentList({ applicantId, applicants, setApplicants }) {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const fileInputRef = useRef(null);

  const applicant = applicants.find((app) => app.id === applicantId);

  // Track file upload status for each document
  const [fileUploadedStatus, setFileUploadedStatus] = useState(
    applicant.documents.reduce((acc, doc) => {
      acc[doc.id] = false; // Initialize with false (file not uploaded)
      return acc;
    }, {})
  );

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
                          name: file.name, // Store only the file name
                        },
                      ],
                    }
                  : doc
              ),
            }
          : app
      );

      setApplicants(updatedApplicants);
      setFileUploadedStatus((prev) => ({ ...prev, [docId]: true })); // Mark file as uploaded for this document
      setFile(null); // Reset file input
      fileInputRef.current.value = ""; // Reset file input field
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Delete a document
  const handleDeleteDocument = (docId) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId
        ? {
            ...app,
            documents: app.documents.filter((doc) => doc.id !== docId),
          }
        : app
    );

    setApplicants(updatedApplicants);
  };

  return (
    <div
      className="document-section"
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>Documents for {applicant.name}</h3>

      {/* Add Document Form */}
      <Form onSubmit={handleAddDocument}>
        <Row className=" m-3 justify-content-center">
          <Col xs="auto" className="mt-2">
            <Form.Group>
              <Form.Control
                type="text"
                size="lg"
                placeholder="Enter Document Name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="mt-2">
            <Button type="submit" size="lg">
              + Add Document
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Document List */}
      <div
        className="document-list"
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {applicant?.documents.length === 0 ? (
          <p>No documents added.</p>
        ) : (
          applicant.documents.map((doc) => (
            <div
              key={doc.id}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Button
                variant={
                  selectedDocument === doc.id ? "primary" : "outline-primary"
                }
                title="Toogle to Open/Close"
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
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h5>
            Files for{" "}
            {
              applicant.documents.find((doc) => doc.id === selectedDocument)
                ?.name
            }
          </h5>

          {/* Display the file names */}
          {applicant.documents
            .find((doc) => doc.id === selectedDocument)
            ?.files.map((file) => (
              <div key={file.id}>
                <p>{file.name}</p> {/* Only show the file name */}
              </div>
            ))}

          {/* File upload for the selected document */}
          {!fileUploadedStatus[selectedDocument] && (
            <>
              <Row className=" m-3 justify-content-center">
                <Col xs="auto" className="mt-2">
                  <Form.Group>
                    <Form.Control
                      type="file"
                      size="sm"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto" className="mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddFileToDocument(selectedDocument)}
                  >
                    + Add File
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentList;
