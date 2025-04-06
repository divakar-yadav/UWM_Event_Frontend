import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function RubricModel({ show, handleClose, rubricType }) {
  const getRubricContent = () => {
    switch (rubricType) {
      case "poster":
        return (
          <>
            <h5>Research (50 points)</h5>
            <ul>
              <li>Research is original and innovative</li>
              <li>Relevant to current industry needs</li>
              <li>Sound methodology</li>
              <li>Clear conclusions</li>
            </ul>
            <h5>Communication (30 points)</h5>
            <ul>
              <li>Explains research clearly to any audience</li>
              <li>Good volume, pace, enthusiasm</li>
            </ul>
            <h5>Appearance & Presentation (20 points)</h5>
            <ul>
              <li>Logical layout</li>
              <li>High-quality visuals</li>
            </ul>
          </>
        );
      case "explearning":
        return (
          <>
            <h5>Reflection (50 points)</h5>
            <ul>
              <li>Detailed, meaningful reflection</li>
              <li>Connected to career/education</li>
              <li>Challenges and growth discussed</li>
            </ul>
            <h5>Communication (30 points)</h5>
            <ul>
              <li>Clear explanation of experience</li>
              <li>Accessible to all audiences</li>
              <li>Good delivery and enthusiasm</li>
            </ul>
            <h5>Appearance & Presentation (20 points)</h5>
            <ul>
              <li>Clear and logical layout</li>
              <li>High-quality visuals</li>
            </ul>
          </>
        );
      case "3mt":
        return (
          <>
            <h5>Comprehension & Content (10 points)</h5>
            <ul>
              <li>Audience understands the research</li>
              <li>Clear objectives and logical flow</li>
            </ul>
            <h5>Engagement (10 points)</h5>
            <ul>
              <li>Captures and maintains attention</li>
              <li>Conveys enthusiasm</li>
            </ul>
            <h5>Communication (10 points)</h5>
            <ul>
              <li>Uses accessible language</li>
              <li>Good voice, pace, confidence</li>
              <li>Slide enhances presentation</li>
            </ul>
            <h5>Overall Impression (10 points)</h5>
          </>
        );
      default:
        return <p>No rubric available.</p>;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Scoring Rubric</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getRubricContent()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RubricModel;
