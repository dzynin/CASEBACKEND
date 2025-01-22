// TextEditor.js
import React, { useContext, useCallback, useEffect, useState } from "react";
import Quill from "quill";
import { Button, Spinner, FormControl } from "react-bootstrap";
import "quill/dist/quill.snow.css";
import { UserContext } from "./App";
import { FaRegPaperPlane, FaBriefcase, FaFile } from 'react-icons/fa';
import { pdfExporter } from "quill-to-pdf";
import { saveAs } from "file-saver";
import { useSocket } from './shared/SocketContext'; // Use the context

const SAVE_INTERVAL_MS = 15000;

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor({ id, fileName, showTextEditor, setShowTextEditor }) {
    const documentId = id;
    const [quill, setQuill] = useState();
    const { state } = useContext(UserContext);
    const [isQuillReady, setIsQuillReady] = useState(false);
    const [openaiResponses, setOpenaiResponses] = useState([]);
    const [openaiRecommendations, setOpenaiRecommendations] = useState([]);
    const [query, setQuery] = useState('');
    const [requestCounter, setRequestCounter] = useState({ recommendations: 0, caselaw: 0, clause: 0 });
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [loadingCaselaw, setLoadingCaselaw] = useState(false);
    const [loadingClause, setLoadingClause] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [latestReceivedIndex, setLatestReceivedIndex] = useState(-1);
    const socket = useSocket();

    const exportAsPDF = async () => {
        const delta = quill.getContents();
        const pdfAsBlob = await pdfExporter.generatePdf(delta);
        saveAs(pdfAsBlob, "current-draft-on-case.pdf");
    };

    useEffect(() => {
        if (showTextEditor) {
            setRequestCounter({ recommendations: 0, caselaw: 0, clause: 0 });
        }
    }, [showTextEditor]);

    useEffect(() => {
        if (!socket || !quill) return;
        handleEditDocument();

        const loadDocument = (document) => {
            let documentText = '';

            if (document.text_body) {
                documentText = document.text_body;
            }

            if (documentText) {
                quill.setText(documentText);
            } else {
                quill.setText('Document not found or is empty.');
            }

            quill.enable();
        };

        socket.on("document-loaded", loadDocument);

        return () => {
            socket.off("document-loaded", loadDocument);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents());
        }, SAVE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        };
        socket.on("receive-changes", handler);

        return () => {
            socket.off("receive-changes", handler);
        };
    }, [socket, quill]);

    useEffect(() => {
        if (quill != null && state.highlightTextForEditor) {
            const length = quill.getLength();
            quill.insertText(length, "\n" + state.highlightTextForEditor);
        }
    }, [quill, state.highlightTextForEditor]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        });

        q.enable();
        setQuill(q);
        setIsQuillReady(true);
    }, []);

    const handleAppeal = () => {
        if (socket && socket.connected) {
            const dataToSend = { 
                content: 'Your input data here',
                documentId: documentId,
                filename: fileName,
            };
            console.log('Appeal clicked. Emitting openai_appeal_call with data:', dataToSend);
            socket.emit("openai_appeal_call", dataToSend);
        } else {
            console.log("Socket is not connected.");
        }
    };

    const insertTextIntoQuill = (text) => {
        const length = quill.getLength();
        quill.insertText(length, "\n" + text + "\n\n");
        quill.setSelection(length + text.length + 2);
    };

    const insertHighlightIntoQuill = (highlightContent) => {
        const position = quill.getLength();
        quill.insertText(position, "\n" + highlightContent + "\n\n");
        quill.setSelection(position + highlightContent.length + 2);
    };

    const handleEditDocument = () => {
        socket.emit("get-document", JSON.stringify({ documentId, fileName }));
    };

    const handleNewDocument = () => {
        quill.setText('');
    };

    const handleClose = () => {
        setShowTextEditor(false);
        // socket.disconnect();
    };

    const handleNoteSave = () => {
        if (socket == null || quill == null) return;
        socket.emit("save-document", quill.getContents());
        exportAsPDF();
    };

    const handleRequest = (type) => {
        console.log(`Attempting to request ${type}...`);
        if (socket && socket.connected && quill) {
            console.log(`Socket is connected, sending ${type} request.`);
            const quillContent = quill.getContents();
            const currentCount = requestCounter[type] + 1;
            console.log(`counter number is ${currentCount} request.`);

            const requestData = { 
                content: quillContent,
                documentId: documentId,
                filename: fileName,
                requestCount: currentCount,
            };

            switch (type) {
                case "recommendations":
                    socket.emit("openai-get-recommendation", requestData);
                    setLoadingRecommendations(true);
                    break;
                case "caselaw":
                    socket.emit("openai-get-caselaw", requestData);
                    setLoadingCaselaw(true);
                    break;
                case "clause":
                    socket.emit("openai-get-clause", requestData);
                    setLoadingClause(true);
                    break;
                default:
                    console.log("Unknown request type");
            }
            setRequestCounter({
                ...requestCounter,
                [type]: currentCount,
            });
        } else {
            console.log("Socket is not connected or Quill is not initialized.");
        }
    };

    useEffect(() => {
        if (!socket || !isQuillReady) return;

        const recommendationHandler = (data) => {
            setOpenaiRecommendations(currentRecommendations => [...currentRecommendations, data.recommendation]);
            setLoadingRecommendations(false);
            setLoadingCaselaw(false);
            setLoadingSend(false);
            setLoadingClause(false);
        };

        socket.on("openai-recommendations", recommendationHandler);
        socket.on("openai-caselaw", recommendationHandler);
        socket.on("openai-clause", recommendationHandler);
        socket.on("openai-query-response", recommendationHandler);

        return () => {
            socket.off("openai-recommendations", recommendationHandler);
            socket.off("openai-caselaw", recommendationHandler);
            socket.off("openai-clause", recommendationHandler);
            socket.off("openai-query-response", recommendationHandler);
        };
    }, [socket, isQuillReady, setLoadingRecommendations, setLoadingCaselaw, setLoadingSend, setLoadingClause]);

    useEffect(() => {
        if (!socket || !isQuillReady) return;

        const handler = (data) => {
            setOpenaiResponses(currentResponses => [data.message, ...currentResponses]);
            setLoadingRecommendations(false);
            setLoadingCaselaw(false);
            setLoadingSend(false);
            setLoadingClause(false);
            insertTextIntoQuill(data.message);
        };

        socket.on("openai_response", handler);

        return () => {
            socket.off("openai_response", handler);
        };
    }, [socket, isQuillReady, setLoadingRecommendations, setLoadingCaselaw, setLoadingSend, setLoadingClause]);

    const handleSend = () => {
        if (!socket || !quill || !query) return;

        const quillContent = quill.getContents();
        const dataToSend = { 
            query: query,
            content: quillContent,
            documentId: documentId,
            filename: fileName
        };

        socket.emit("openai-query", dataToSend);
        setLoadingSend(true);
        setQuery('');
    };

    return (
        <React.Fragment>
            <div style={{ padding: "10px", backgroundColor: '#191c24', textAlign: 'center' }}>
                <Button variant="outline-info" onClick={handleNewDocument} style={{ margin: '10px' }}>
                    <FaFile /> New Document
                </Button>
                <Button variant="outline-success" onClick={handleEditDocument} style={{ margin: '10px' }}>
                    <FaBriefcase /> Edit Document
                </Button>
                <Button variant="outline-primary" onClick={handleAppeal} style={{ margin: '10px' }}>
                    <FaRegPaperPlane /> Appeal
                </Button>
            </div>
            <div style={{ color: "white", background: '#191c24', padding: '20px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Notepad</h2>
                    <div>
                        <Button variant="primary" onClick={handleNoteSave} style={{ marginRight: '10px' }}>Save</Button>
                        <Button variant="secondary" onClick={handleClose} style={{ fontSize: '16px', lineHeight: '1', padding: '0.375rem 0.75rem' }}>
                            <span aria-hidden="true">&times;</span>
                        </Button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', height: '76vh' }}>
                    <div style={{ flex: 7, marginRight: '20px', background: '#2a3038', borderRadius: '8px', padding: '10px' }} ref={wrapperRef}></div>
                    <div style={{ flex: 3, paddingLeft: '2px', overflowY: 'auto', background: '#2A3038', borderRadius: '8px', padding: '10px' }}>
                        <Button variant="outline-primary" onClick={() => handleRequest('recommendations')}>
                            {loadingRecommendations ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : 'Insights'}
                        </Button>
                        <Button variant="outline-success" onClick={() => handleRequest('caselaw')}>
                            {loadingCaselaw ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : 'Caselaw'}
                        </Button>
                        <Button variant="outline-info" onClick={() => handleRequest('clause')}>
                            {loadingClause ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : 'Clause'}
                        </Button>
                        <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                            {openaiRecommendations.map((recommendation, index) => (
                                <div 
                                    key={index} 
                                    className="sidebar__highlight"  
                                    style={{
                                        padding: '10px', 
                                        margin: '5px 0', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        backgroundColor: index === latestReceivedIndex ? '2A3038' : '2A3038', 
                                        animation: index === latestReceivedIndex ? 'flash 1s infinite alternate' : 'none'
                                    }}
                                    onMouseEnter={() => setLatestReceivedIndex(index)}
                                    onMouseLeave={() => setLatestReceivedIndex(-1)}
                                >
                                    <span style={{ fontSize: '10px' }}>{recommendation}</span>
                                    <Button variant="outline-secondary" onClick={() => insertHighlightIntoQuill(recommendation)}>Insert</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-100 d-flex justify-content-between align-items-center" style={{ marginTop: '10px' }}>
                    <FormControl
                        type="text"
                        placeholder="Ask Casebook AI a question"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="nav-link mt-2 mt-md-0 d-none d-lg-flex search mx-3"
                    />
                    <Button variant="info" onClick={handleSend}>
                        {loadingSend ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : 'Send'}
                    </Button>
                </div>
                <style>
                    {`
                        @keyframes flash {
                            from {
                                background-color: #2A3038;
                            }
                            to {
                                background-color: #32435a;
                            }
                        }
                    `}
                </style>
            </div>
        </React.Fragment>
    );
}
