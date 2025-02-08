import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa"; // Changed icon for better UI

function AddApplicant() {
  const [applicants, setApplicants] = useState([
    { id: 1, name: "Applicant_1", documents: [{ id: 1, name: "Document_1" }] },
  ]);
  const [selectedApplicantId, setSelectedApplicantId] = useState(1);
  const [selectedDocId, setSelectedDocId] = useState(1);

  const addApplicant = () => {
    const newApplicant = {
      id: applicants.length + 1,
      name: `Applicant_${applicants.length + 1}`,
      documents: [],
    };
    setApplicants([...applicants, newApplicant]);
  };

  const addDocument = () => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.id === selectedApplicantId
          ? {
              ...applicant,
              documents: [
                ...applicant.documents,
                {
                  id: applicant.documents.length + 1,
                  name: `Document_${applicant.documents.length + 1}`,
                },
              ],
            }
          : applicant
      )
    );
  };

  const deleteApplicant = (id) => {
    setApplicants(applicants.filter((applicant) => applicant.id !== id));
    if (selectedApplicantId === id) {
      setSelectedApplicantId(null);
      setSelectedDocId(null);
    }
  };

  const deleteDocument = (docId) => {
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.id === selectedApplicantId
          ? {
              ...applicant,
              documents: applicant.documents.filter((doc) => doc.id !== docId),
            }
          : applicant
      )
    );
    if (selectedDocId === docId) {
      setSelectedDocId(null);
    }
  };

  const selectApplicant = (id) => {
    setSelectedApplicantId(id);
    setSelectedDocId(null);
  };

  const selectDocument = (id) => {
    setSelectedDocId(id);
  };

  const handleFileChange = (e) => {
    // Handle file upload logic
  };

  const handleNext = () => {
    const currentApplicantIndex = applicants.findIndex(
      (app) => app.id === selectedApplicantId
    );
    const currentApplicant = applicants[currentApplicantIndex];

    if (selectedDocId < currentApplicant.documents.length) {
      setSelectedDocId((prev) => prev + 1);
    } else if (currentApplicantIndex < applicants.length - 1) {
      setSelectedApplicantId(applicants[currentApplicantIndex + 1].id);
      setSelectedDocId(1);
    }
  };

  const handleBack = () => {
    const currentApplicantIndex = applicants.findIndex(
      (app) => app.id === selectedApplicantId
    );

    if (selectedDocId > 1) {
      setSelectedDocId((prev) => prev - 1);
    } else if (currentApplicantIndex > 0) {
      setSelectedApplicantId(applicants[currentApplicantIndex - 1].id);
      const prevApplicantDocs =
        applicants[currentApplicantIndex - 1].documents.length;
      setSelectedDocId(prevApplicantDocs > 0 ? prevApplicantDocs : null);
    }
  };

  const selectedApplicant = applicants.find(
    (app) => app.id === selectedApplicantId
  );

  return (
    <div className="container-fluid">
      <h1 className="header">
        <img
          src="https://icons.veryicon.com/png/o/business/general-office-icon/general-upload-file.png"
          alt="DocTrack"
          className="logo"
        />
        DocTrack
      </h1>

      <Row>
        <Col xs="auto" className="m-2">
          <Button onClick={addApplicant}>+ Add Applicant</Button>
        </Col>
      </Row>

      <Row className="applicantList">
        <Col className="m-2">
          {applicants.length > 0 && (
            <section className="scroll-container">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="applicant-item">
                  <div
                    className={`applicant-name ${
                      selectedApplicantId === applicant.id ? "selected" : ""
                    }`}
                    onClick={() => selectApplicant(applicant.id)}
                  >
                    {applicant.name}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="delete-btn"
                    onClick={() => deleteApplicant(applicant.id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              ))}
            </section>
          )}
        </Col>
      </Row>

      {selectedApplicant && (
        <section className="documents">
          <Row>
            <Col xs={2}>
              <Button onClick={addDocument}>+ Add Document</Button>
              <div className="document-list">
                {selectedApplicant.documents.map((document) => (
                  <div key={document.id} className="document-item">
                    <span
                      className={`document-name ${
                        selectedDocId === document.id ? "selected-doc" : ""
                      }`}
                      onClick={() => selectDocument(document.id)}
                    >
                      {document.name}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      className="delete-btn1"
                      onClick={() => deleteDocument(document.id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={8} className="fileUpload">
              <h1>
                Upload Files For Applicant {selectedApplicantId}
                {selectedApplicant.documents.length === 0
                  ? " - Add Document"
                  : ` - Document ${
                      selectedDocId === null ? "Not selected" : selectedDocId
                    }`}
              </h1>
              <Form.Control type="file" onChange={handleFileChange} />
            </Col>
          </Row>
          <Row className="navigation-buttons mt-3">
            <Col className="navbutton">
              <Button
                onClick={handleBack}
                disabled={selectedApplicantId === 1 && selectedDocId === 1}
                className="mr-3" // Adds space between the buttons
              >
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </Col>
          </Row>
        </section>
      )}
    </div>
  );
}

export default AddApplicant;
