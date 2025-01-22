import React, { useState } from "react";
import { Button, Card, CardBody, Row, Col, Input, FormGroup } from "reactstrap";

function ActionCard({ onHelpClick }) {
    const [caseName, setCaseName] = useState("");
    const [inputVisible, setInputVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState("");

    const handleHelpClick = (action) => {
        setInputVisible(true);
        setSelectedAction(action);  // Save the text of the button clicked in row one, if any
    };

    const handleSubmit = () => {
        if (caseName.trim() !== "") {
            const caseDetails = {
                caseName,
                action: selectedAction
            };
            onHelpClick(caseDetails);
            setInputVisible(false);  // Optionally reset the UI state
            setCaseName("");
            setSelectedAction("");
        }
    };

    return (
        <Card className="dashboard-card">
            <CardBody>
                <Row>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Pleadings")}>📄 Pleadings</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Discovery")}>🔍 Discovery</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Trial")}>⚖️ Trial</Button>
                    </Col>
                    <Col lg={3} md={6} xs={12} sm={12}>
                        <Button className="action-button" onClick={() => handleHelpClick("Appeal")}>📜 Appeal</Button>
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
                            <Button className="important-button" style={{ width: "200px",height:'38px', marginTop: "-2px" }} onClick={handleSubmit}>
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
