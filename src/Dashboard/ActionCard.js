import React, { useState } from "react";
import { Button, Card, CardBody, Row, Col, Input, FormGroup } from "reactstrap";
function ActionCard({ onHelpClick }) {
    const [caseName, setCaseName] = useState("");
    const [inputVisible, setInputVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState(""); // Stores the document type

    const handleHelpClick = (action) => {
        setInputVisible(true);
        setSelectedAction(action); // Store selected document type
    };

    const handleSubmit = () => {
        if (caseName.trim() !== "") {
            const caseDetails = {
                caseName,
                document_class: selectedAction // Include document type
            };
            onHelpClick(caseDetails.caseName, caseDetails.document_class);
            setInputVisible(false);
            setCaseName("");
            setSelectedAction("");
        }
    };

    return (
        <Card className="dashboard-card">
            <CardBody>
                <Row>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Contract")}>📄 Contract</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Patents")}>🔍 Patents</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Litigation")}>⚖️ Litigation</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Compliance")}>📜 Compliance</Button>
                    </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                    {inputVisible ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <FormGroup style={{ width: "200px" }}>
                                <Input
                                    type="text"
                                    value={caseName}
                                    onChange={(e) => setCaseName(e.target.value)}
                                    placeholder="Enter case name"
                                />
                            </FormGroup>
                            <Button className="important-button" style={{ width: "200px", height: '38px', marginTop: "-2px" }} onClick={handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    ) : (
                        <Button className="important-button" onClick={() => handleHelpClick("")}>
                            Help me with a new case
                        </Button>
                    )}
                </Row>
            </CardBody>
        </Card>
    );
}

export default ActionCard;
