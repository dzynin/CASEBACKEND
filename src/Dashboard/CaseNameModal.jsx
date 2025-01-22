import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap";

function CaseNameModal({ isOpen, toggle, onSubmit }) {
    const [caseName, setCaseName] = useState("");

    const handleInputChange = (e) => {
        setCaseName(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(caseName);
        toggle();  // Close modal after submission
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Enter Case Name</ModalHeader>
            <ModalBody>
                <Label for="caseName">Case Name:</Label>
                <Input
                    id="caseName"
                    value={caseName}
                    onChange={handleInputChange}
                    placeholder="Type the name of the case here..."
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}

export default CaseNameModal;
