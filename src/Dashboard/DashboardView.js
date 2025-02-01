import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import DashboardCard from "../shared/DashboardCard";
import MultiFileUpload from "./MultiFileUpload";
import ActionCard from "./ActionCard";
import DashboardFirstRowCard from "../shared/DashboardFirstRowCard"; // Import the new component
function DashboardView() {
    const [showUpload, setShowUpload] = useState(false);
    const [caseName, setCaseName] = useState("");
    const [document_class, setDocumentClass] = useState("");

    const handleHelpClick = (name, document_class) => {
        setCaseName(name);
        setDocumentClass(document_class); // Store document type
        setShowUpload(true);
        console.log('document_class', document_class);
        console.log('case_name', name);
    };

    const handleBackClick = () => {
        setShowUpload(false);
    };

    return (
        <div className="dashboard-view bg-dark3 p-5 text-center" style={{ width: "100%", color: "#b2b8d2" }}>
            <Row className="dashboard-cards-row" style={{ maxHeight: "100px" }}>
                <Col lg={3} md={4} xs={12} sm={12}>
                    <DashboardFirstRowCard title={"Cases"} icon={"mdi-case-sensitive-alt"} footerText={""} number={7} color={"success"} />
                </Col>
                <Col lg={3} md={4} xs={12} sm={12}>
                    <DashboardFirstRowCard title={"Statute"} icon={"mdi-scale-balance"} footerText={""} number={3} color={"danger"} />
                </Col>
                <Col lg={3} md={4} xs={12} sm={12}>
                    <DashboardFirstRowCard title={"Community"} icon={"mdi-account"} footerText={""} number={3} color={"warning"} />
                </Col>
                <Col lg={3} md={4} xs={12} sm={12}>
                    <DashboardFirstRowCard title={"Caselaw"} icon={"mdi-note-outline"} footerText={""} number={12} color={"success"} />
                </Col>
            </Row>
            <Row className="mt-5">
                <Col xs={12}>
                    {!showUpload && <ActionCard onHelpClick={handleHelpClick} />}
                    {showUpload && <MultiFileUpload onBackClick={handleBackClick} caseName={caseName} document_class={document_class} />}
                </Col>
            </Row>
        </div>
    );
}

export default DashboardView;
