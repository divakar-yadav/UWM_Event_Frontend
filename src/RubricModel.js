import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";



function RubricModel({ show, handleClose, rubricType }) {
  
  const getRubricContent = () => {
    switch (rubricType) {
      case "poster":
        return (
          <>
          
            <h5>Research (up to 50 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Research is original and innovative</li>
              <li>Research has practical implications/research is relevant to current industry needs</li>
              <li>Research methodology is sound (e.g., research process, data quantity is sufficient)</li>
              <li>The result/conclusion of the research is clear and easy to understand</li>
            </ul>
            <h5>Communication (up to 30 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Student clearly explains project, including initial problem or question, the process, and the result/conclusion</li>
              <li>Student is able to explain the research in a way that is easily understood by those outside the subject area or without the specific technical expertise</li>
              <li>Student speaks at an appropriate volume and pace</li>
              <li>Student demonstrates enthusiasm for the topic</li>
            </ul>
            <h5>Appearance & Presentation (up to 20 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Research is displayed in a logical way</li>
              <li>Data is displayed in such a way that lends itself to clear interpretation</li>
              <li>Pictures, digital images and graphs are of a high quality</li>
            </ul>
          </>
        );
      case "explearning":
        return (
          <>
            <h5>Reflection (up to 50 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Experience is described in detail with emphasis on growth and learning</li>
              <li>Reflection describes how the experience related to a student’s education and/or career aspirations</li>
              <li>Reflection includes challenges and how they were addressed</li>
              <li>Reflection is personal and meaningful</li>
            </ul>
            <h5>Communication (up to 30 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Student clearly explains project, including initial problem or question, the process, and the result/conclusion</li>
              <li>Student is able to explain the research in a way that is easily understood by those outside the subject area or without the specific technical expertise</li>
              <li>Student speaks at an appropriate volume and pace</li>
              <li>Student demonstrates enthusiasm for the topic</li>
            </ul>
            <h5>Appearance & Presentation (up to 20 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Information is displayed in a logical way</li>
              <li>Data is displayed in such a way that lends itself to clear interpretation</li>
              <li>Pictures, digital images and graphs are of a high quality</li>
            </ul>
          </>
        );
      case "3mt":
        return (
          <>
            <h5>Comprehension & Content (up to 10 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Did the presentation help the audience understand the research?</li>
              <li>Did the presenter clearly outline the nature and aims of research?</li>
              <li>Do you know what is significant about this research?</li>
              <li>Did the presentation follow a logical sequence?</li>
            </ul>
            <h5>Engagement (up to 10 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Did the presentation make the audience want to know more?</li>
              <li>Was the presenter careful not to trivialize or over-simplify their research?</li>
              <li>Did the presenter convey enthusiasm for their work?</li>
              <li>Did the presenter capture and maintain their audience’s attention?</li>
            </ul>
            <h5>Communication (up to 10 points)</h5>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>Was the thesis topic and its significance communicated in language appropriate to a non-specialist audience?</li>
              <li>Did the speaker use sufficient eye contact and vocal range; maintain a steady pace, and a confident stance?</li>
              <li>Did the speaker avoid scientific jargon, explain terminology that needed to be used, and provide adequate background information to illustrate points?</li>
              <li>Did the PowerPoint slide enhance the presentation?</li>
            </ul>
            <h5>Overall Impression (up to 10 points)</h5>
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
