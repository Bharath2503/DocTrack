import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";

function DocumentList({ applicantId, applicants, setApplicants }) {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Ref to reset file input

  // Find the specific applicant
  const applicant = applicants.find((app) => app.id === applicantId);

  // Handle adding a new document
  const handleAddDocument = (e) => {
    e.preventDefault();

    if (documentName.trim() !== "" && file) {
      const newDocument = {
        id: Date.now(),
        name: documentName,
        file: file.name, // Store file name
        fileObject: file, // Store the actual file object
      };

      // Update the applicant's document list
      const updatedApplicants = applicants.map((app) =>
        app.id === applicantId ? { ...app, documents: [...app.documents, newDocument] } : app
      );

      setApplicants(updatedApplicants);
      setDocumentName(""); // Clear inputs
      setFile(null);
      fileInputRef.current.value = ""; // ✅ Reset file input field
    }
  };

  // Handle deleting a document
  const handleDeleteDocument = (id) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId
        ? { ...app, documents: app.documents.filter((doc) => doc.id !== id) }
        : app
    );

    setApplicants(updatedApplicants);
  };

  return (
    <div style={{ marginLeft: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Documents for {applicant.name}</h3>

      {/* Add document form */}
      <Form onSubmit={handleAddDocument}>
        <Form.Control
          type="text"
          placeholder="Enter Document Name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          required
        />
        <br />

        <Form.Control type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} required />
        <br />

        <Button type="submit" size="sm">
          + Add Document
        </Button>
      </Form>

      {/* Display list of uploaded documents */}
      <div style={{ marginTop: "10px" }}>
        {applicant?.documents.length === 0 ? (
          <p>No documents added.</p>
        ) : (
          applicant.documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <span>{doc.name}</span> {/* Document Name */}
                <br />
                <small>{doc.file}</small> {/* Display uploaded file name */}
                {/* <a href={URL.createObjectURL(doc.fileObject)} download={doc.file} style={{ marginLeft: "10px" }}>
                  [Download]
                </a> */}
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocumentList;
