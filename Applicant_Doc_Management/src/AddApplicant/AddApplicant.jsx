import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaDeleteLeft } from "react-icons/fa6";
import DocumentList from "../AddDocument/DocumentList";

function AddApplicant() {
  const [addName, setAddName] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null); // Track selected applicant

  // Handle input change
  const handleChange = (e) => {
    setAddName(e.target.value);
  };

  // Handle adding a new applicant
  const handleCreate = (e) => {
    e.preventDefault();
    if (addName.trim() !== "") {
      setApplicants([
        ...applicants,
        { id: Date.now(), name: addName, documents: [] }, // Initialize with an empty document list
      ]);
      setAddName(""); // Clear input after adding
    }
  };

  // Handle deleting an applicant
  const handleDelete = (id) => {
    setApplicants((prevApplicants) =>
      prevApplicants.filter((applicant) => applicant.id !== id)
    );
    if (selectedApplicantId === id) {
      setSelectedApplicantId(null); // Reset selected applicant if deleted
    }
  };

  // Toggle visibility of the document list for a selected applicant
  const handleSelectApplicant = (id) => {
    setSelectedApplicantId(selectedApplicantId === id ? null : id);
  };

  return (
    <>
      <Form onSubmit={handleCreate}>
        <h1 className="m-2 ">
          {" "}
          <img
            src="https://icons.veryicon.com/png/o/business/general-office-icon/general-upload-file.png"
            alt="DocTrack"
            width={"100px"}
          />{" "}
          DocTrack
        </h1>
        <Row className=" m-3 justify-content-center">
          <Col xs="auto" className="mt-3">
            <Form.Control
              type="text"
              size="lg"
              required
              placeholder="Enter Applicant Name"
              value={addName}
              onChange={handleChange}
            />
          </Col>
          <Col xs="auto" className="mt-3">
            <Button type="submit" size="lg">
              + Add Applicant
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Show applicants section only if there are applicants */}
      {applicants.length > 0 && (
        <section
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Row
            className="m-3"
            style={{ display: "flex", flexWrap: "nowrap", gap: "10px" }}
          >
            {applicants.map((applicant, index) => (
              <Col key={applicant.id} xs="auto">
                <Button
                  variant="success"
                  size="lg"
                  className="applicant-name"
                  onClick={() => handleSelectApplicant(applicant.id)}
                >
                  {index + 1}. {applicant.name}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="delete-btn ms-2"
                  onClick={() => handleDelete(applicant.id)}
                >
                  <FaDeleteLeft />
                </Button>
              </Col>
            ))}
          </Row>
        </section>
      )}

      {/* Display the DocumentList below the selected applicant */}
      {selectedApplicantId && (
        <Row className="m-3">
          <Col>
            <DocumentList
              applicantId={selectedApplicantId}
              applicants={applicants}
              setApplicants={setApplicants}
            />
          </Col>
        </Row>
      )}
    </>
  );
}

export default AddApplicant;
