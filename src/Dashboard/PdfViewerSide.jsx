import React, { useState, useContext, useEffect } from 'react';
import { Resizable } from "react-resizable";
import TextEditor from "../TextEditor";
import { UserContext } from "../App";
import PdfGraphFunc from "./PdfGraphFunc";
import { Modal } from "react-bootstrap";
import AccordionRenderer from '../Dashboard/AccordionRenderer';

const PdfViewerSide = ({ createNotes, showGraph, showGraphModal, setShowGraphModal, setCreateNotes, setShowGraph }) => {
    const { state } = useContext(UserContext);
    const [dimensions, setDimensions] = useState({
        height: 720,
        width: 250
    });

    // useEffect to log and act on changes in accordionSections
    useEffect(() => {
        console.log('Accordion Sections Updated:', state.accordionSections);
        // Here you can also perform actions based on the updated accordionSections
        // For example, checking for empty sections, handling errors, etc.
    }, [state.accordionSections]); // Dependency array includes only accordionSections to react specifically to its changes
// // 
// useEffect(() => {
//     return () => console.log('Unmounting PdfViewer, current accordionSections:', state.accordionSections);
// }, []);  // Logs on unmount to see what state is at that time

    return (
        <Resizable
            className="box"
            height={720}
            axis="x"
            width={250}
            onResize={(e, { size }) => {
                setDimensions({
                    height: size.height,
                    width: size.width,
                });
            }}
            resizeHandles={["w"]}
        >
            <div
                className="sidebarnew"
                style={{
                    minWidth: "20%",
                    width: "250px" || "25%",
                    height: '100vh',
                }}
            >
                <div>
                    {createNotes && (
                        <TextEditor
                            id={state.auth && state.auth.userPublicId}
                            fileName={state.currentFile && state.currentFile.name}
                            showTextEditor={createNotes}
                            setShowTextEditor={setCreateNotes}
                        />
                    )}
                    {!showGraphModal && showGraph && <PdfGraphFunc />}
                    {showGraphModal && (
                        <Modal
                            style={{ color: "#050505" }}
                            show={showGraphModal}
                            onHide={() => setShowGraphModal(false)}
                            backdrop="static"
                            size="lg"
                            centered={true}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-sm">
                                    Graph
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <PdfGraphFunc />
                            </Modal.Body>
                        </Modal>
                    )}
                    {state.accordionSections && <AccordionRenderer data={state.accordionSections} />}
                </div>
            </div>
        </Resizable>
    );
};

export default PdfViewerSide;
