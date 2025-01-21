// import React, { useContext, useEffect, useState, useRef } from "react";
// import {
//     PdfLoader,
//     PdfHighlighter,
//     Highlight,
//     Popup,
//     AreaHighlight,
// } from "react-pdf-highlighter";

// import StickyNote from './StickyNote';
// import { Container } from "react-bootstrap";
// import styled from "styled-components";
// import Spinner from "../shared/Spinner";
// import Tip from "./Tip";
// import processMd from "./markdown";
// import { UserContext } from "../App";
// import PdfAutoScroller from './PdfAutoScroller';
// import TextEditor from "../TextEditor";

// const getNextId = () => String(Math.random()).slice(2);

// const parseIdFromHash = () =>
//     document.location.hash.slice("#pdf-highlight-".length);

// const resetHash = () => {
//     document.location.hash = "";
// };

// const HighlightPopup = ({ comment }) =>
//     comment.text ? (
//         <div className="Highlight__popup">
//             {comment.emoji} {processMd(comment.text)}
//         </div>
//     ) : null;

// const Wrapper = styled.div`
//   .Highlight__part {
//     background: ${props => props.highlightColors.default || "#000000"};
//   }
//   .AreaHighlight {
//     border: 3px solid ${props => props.highlightColors.default || "#000000"};
//   }
//   .Highlight__part.OTHER {
//     background: rgb(93, 115, 240);
//   }
//   .Highlight__part.LEGALTEST {
//     background: ${props => props.highlightColors.legalTest};
//   }
//   .Highlight__part.ISSUE {
//     background: ${props => props.highlightColors.issue};
//   }
//   .Highlight__part.CONCLUSION {
//     background: ${props => props.highlightColors.conclusion};
//   }
// `;

// function PdfViewer() {
//     const { state, dispatch } = useContext(UserContext);
//     const [currFile, setCurrFile] = useState(null);
//     const [highlights, setHighlights] = useState([]);

//     useEffect(() => {
//         if (highlights.length > 0) {
//             dispatch({
//                 type: "SET_FILE_HIGHLIGHTS",
//                 payload: {
//                     highlights,
//                     name: state.currentFile?.name,
//                 },
//             });
//         }
//     }, [highlights]);

//     useEffect(() => {
//         if (state.currentFile) {
//             if (state.currentFile.url) {
//                 setCurrFile(state.currentFile.url);
//             } else if (state.currentFile instanceof Blob) {
//                 const reader = new FileReader();
//                 reader.onload = () => {
//                     setCurrFile(reader.result);
//                 };
//                 reader.readAsDataURL(state.currentFile);
//             } else {
//                 console.error('Current file is not a Blob');
//             }
//         } else {
//             setCurrFile(null);
//         }
//     }, [state.currentFile]);

//     useEffect(() => {
//         if (state.currentFile) {
//             const fileHighlights = state.fileHighlights.find(item => item.name === state.currentFile.name);
//             setHighlights(fileHighlights ? fileHighlights.highlights : []);
//         } else {
//             setHighlights([]);
//         }
//     }, [state.currentFile, state.fileHighlights]);

//     const pdfHighlighter = useRef(null);
//     const getHighlightById = (id) => highlights.find((highlight) => highlight.id === id);

//     const scrollToHighlightFromHash = () => {
//         const highlight = getHighlightById(parseIdFromHash());
//         if (highlight) {
//             pdfHighlighter.current.scrollTo(highlight);
//         }
//     };

//     useEffect(() => {
//         window.addEventListener("hashchange", scrollToHighlightFromHash, false);
//         return () => window.removeEventListener("hashchange", scrollToHighlightFromHash);
//     }, [highlights]);

//     const addHighlight = (highlight) => {
//         setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
//     };

//     const updateHighlight = (highlightId, position, content) => {
//         setHighlights(highlights.map((h) =>
//             h.id === highlightId
//                 ? { ...h, position: { ...h.position, ...position }, content: { ...h.content, ...content } }
//                 : h
//         ));
//     };

//     return (
//         <Wrapper highlightColors={state.highlightColors}>
//             {state.showPdfViewer ? (
//                 <div className="d-flex">
//                     <div style={{ minHeight: "calc(100vh - 70px)", color: "#000000", width: "80%" }} className="pdf-viewer">
//                         {currFile ? (
//                             <>
//                                 <PdfLoader className="my-pdf-viewer" url={currFile} beforeLoad={<Spinner />}>
//                                     {(pdfDocument) => (
//                                         <PdfHighlighter
//                                             ref={pdfHighlighter}
//                                             pdfDocument={pdfDocument}
//                                             enableAreaSelection={(event) => event.altKey}
//                                             onScrollChange={resetHash}
//                                             scrollRef={(scrollTo) => { }}
//                                             onSelectionFinished={(
//                                                 position,
//                                                 content,
//                                                 hideTipAndSelection,
//                                                 transformSelection
//                                             ) => (
//                                                 <Tip
//                                                     onOpen={transformSelection}
//                                                     onConfirm={(comment) => {
//                                                         addHighlight({ content, position, comment });
//                                                         hideTipAndSelection();
//                                                     }}
//                                                 />
//                                             )}
//                                             highlightTransform={(
//                                                 highlight,
//                                                 index,
//                                                 setTip,
//                                                 hideTip,
//                                                 viewportToScaled,
//                                                 screenshot,
//                                                 isScrolledTo
//                                             ) => (
//                                                 <Popup
//                                                     popupContent={<HighlightPopup {...highlight} />}
//                                                     onMouseOver={(popupContent) =>
//                                                         setTip(highlight, (highlight) => popupContent)
//                                                     }
//                                                     onMouseOut={hideTip}
//                                                     key={index}
//                                                 >
//                                                     <StickyNote
//                                                         isScrolledTo={isScrolledTo}
//                                                         position={highlight.position}
//                                                         comment={highlight.comment}
//                                                     />
//                                                     <AreaHighlight
//                                                         highlight={highlight}
//                                                         onChange={(boundingRect) => {
//                                                             updateHighlight(
//                                                                 highlight.id,
//                                                                 { boundingRect: viewportToScaled(boundingRect) },
//                                                                 { image: screenshot(boundingRect) }
//                                                             );
//                                                         }}
//                                                     />
//                                                 </Popup>
//                                             )}
//                                             highlights={highlights}
//                                         />
//                                     )}
//                                 </PdfLoader>
//                             </>
//                         ) : state.files && state.files.length === 0 ? (
//                             <Container>
//                                 <div className="h3 text-center mt-5">No File Selected!!</div>
//                             </Container>
//                         ) : (
//                             <Spinner />
//                         )}
//                     </div>
//                     <PdfAutoScroller pdfHighlighter={pdfHighlighter} />
//                 </div>
//             ) : (
//                 <TextEditor 
//                     id={state.auth?.userPublicId}
//                     fileName={state.currentFile?.name}
//                     showTextEditor={true}
//                     setShowTextEditor={(value) => dispatch({ type: value ? 'SHOW_TEXT_EDITOR' : 'SHOW_PDF_VIEWER' })}
//                 />
//             )}
//         </Wrapper>
//     );
// }

// export default PdfViewer;


import React, { useContext, useEffect, useState, useRef } from "react";
import {
    PdfLoader,
    PdfHighlighter,
    Highlight,
    Popup,
    AreaHighlight,
} from "react-pdf-highlighter";

import StickyNote from './StickyNote';
import { Container } from "react-bootstrap";
import styled from "styled-components";
import Spinner from "../shared/Spinner";
import Tip from "./Tip";
import processMd from "./markdown";
import { UserContext } from "../App";
import PdfAutoScroller from './PdfAutoScroller';
import TextEditor from "../TextEditor";
import { BASE_URL_DEV } from "../utils"; // Import the BASE_URL_DEV

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
    console.log("Parsing ID from URL hash:", document.location.hash);
    return document.location.hash.slice("#pdf-highlight-".length);
};

const resetHash = () => {
    console.log("Resetting URL hash.");
    document.location.hash = "";
};

const HighlightPopup = ({ comment }) => {
    console.log("Rendering HighlightPopup with comment:", comment);
    return comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {processMd(comment.text)}
        </div>
    ) : null;
};

const Wrapper = styled.div`
  .Highlight__part {
    background: ${props => props.highlightColors.default || "#000000"};
  }
  .AreaHighlight {
    border: 3px solid ${props => props.highlightColors.default || "#000000"};
  }
  .Highlight__part.OTHER {
    background: rgb(93, 115, 240);
  }
  .Highlight__part.LEGALTEST {
    background: ${props => props.highlightColors.legalTest};
  }
  .Highlight__part.ISSUE {
    background: ${props => props.highlightColors.issue};
  }
  .Highlight__part.CONCLUSION {
    background: ${props => props.highlightColors.conclusion};
  }
`;

function PdfViewer() {
    console.log("Rendering PdfViewer component...");
    const { state, dispatch } = useContext(UserContext);
    console.log("UserContext state:", state);

    const [currFile, setCurrFile] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const pdfHighlighter = useRef(null);

    useEffect(() => {
        console.log("Effect: highlights updated", highlights);
        if (highlights.length > 0) {
            dispatch({
                type: "SET_FILE_HIGHLIGHTS",
                payload: {
                    highlights,
                    name: state.currentFile?.name,
                },
            });
        }
    }, [highlights]);

    useEffect(() => {
        console.log("Effect: state.currentFile changed", state.currentFile);
        if (state.currentFile) {
            if (state.currentFile.url) {
                // Ensure the correct base URL is used for the PDF
                const correctedUrl = state.currentFile.url.startsWith('http')
                    ? state.currentFile.url
                    : `${BASE_URL_DEV}/${state.currentFile.url}`;
                
                console.log("Setting corrected currFile URL:", correctedUrl);
                setCurrFile(correctedUrl);
            } else if (state.currentFile instanceof Blob) {
                console.log("Reading file as Blob...");
                const reader = new FileReader();
                reader.onload = () => {
                    console.log("FileReader result:", reader.result);
                    setCurrFile(reader.result);
                };
                reader.readAsDataURL(state.currentFile);
            } else {
                console.error('Current file is not a Blob');
            }
        } else {
            console.log("No file selected, setting currFile to null");
            setCurrFile(null);
        }
    }, [state.currentFile]);
    
    useEffect(() => {
        console.log("Effect: updating highlights based on current file");
        if (state.currentFile) {
            const fileHighlights = state.fileHighlights.find(item => item.name === state.currentFile.name);
            console.log("Found highlights for file:", fileHighlights);
            setHighlights(fileHighlights ? fileHighlights.highlights : []);
        } else {
            setHighlights([]);
        }
    }, [state.currentFile, state.fileHighlights]);

    const getHighlightById = (id) => {
        console.log("Getting highlight by ID:", id);
        return highlights.find((highlight) => highlight.id === id);
    };

    const scrollToHighlightFromHash = () => {
        console.log("Scrolling to highlight from hash...");
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight) {
            console.log("Highlight found, scrolling to:", highlight);
            pdfHighlighter.current.scrollTo(highlight);
        } else {
            console.log("No highlight found for hash.");
        }
    };

    useEffect(() => {
        console.log("Adding event listener for hashchange.");
        window.addEventListener("hashchange", scrollToHighlightFromHash, false);
        return () => {
            console.log("Removing event listener for hashchange.");
            window.removeEventListener("hashchange", scrollToHighlightFromHash);
        };
    }, [highlights]);

    const addHighlight = (highlight) => {
        console.log("Adding new highlight:", highlight);
        setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
    };

    const updateHighlight = (highlightId, position, content) => {
        console.log(`Updating highlight ${highlightId} with new position and content`);
        setHighlights(highlights.map((h) =>
            h.id === highlightId
                ? { ...h, position: { ...h.position, ...position }, content: { ...h.content, ...content } }
                : h
        ));
    };

    return (
        <Wrapper highlightColors={state.highlightColors}>
            {state.showPdfViewer ? (
                <div className="d-flex">
                    <div style={{ minHeight: "calc(100vh - 70px)", color: "#000000", width: "80%" }} className="pdf-viewer">
                        {currFile ? (
                            <>
                                <PdfLoader className="my-pdf-viewer" url={currFile} beforeLoad={<Spinner />}>
                                    {(pdfDocument) => (
                                        <PdfHighlighter
                                            ref={pdfHighlighter}
                                            pdfDocument={pdfDocument}
                                            enableAreaSelection={(event) => event.altKey}
                                            onScrollChange={resetHash}
                                            scrollRef={(scrollTo) => { }}
                                            onSelectionFinished={(
                                                position,
                                                content,
                                                hideTipAndSelection,
                                                transformSelection
                                            ) => (
                                                <Tip
                                                    onOpen={transformSelection}
                                                    onConfirm={(comment) => {
                                                        addHighlight({ content, position, comment });
                                                        hideTipAndSelection();
                                                    }}
                                                />
                                            )}
                                            highlightTransform={(
                                                highlight,
                                                index,
                                                setTip,
                                                hideTip,
                                                viewportToScaled,
                                                screenshot,
                                                isScrolledTo
                                            ) => (
                                                <Popup
                                                    popupContent={<HighlightPopup {...highlight} />}
                                                    onMouseOver={(popupContent) =>
                                                        setTip(highlight, (highlight) => popupContent)
                                                    }
                                                    onMouseOut={hideTip}
                                                    key={index}
                                                >
                                                    <StickyNote
                                                        isScrolledTo={isScrolledTo}
                                                        position={highlight.position}
                                                        comment={highlight.comment}
                                                    />
                                                    <AreaHighlight
                                                        highlight={highlight}
                                                        onChange={(boundingRect) => {
                                                            updateHighlight(
                                                                highlight.id,
                                                                { boundingRect: viewportToScaled(boundingRect) },
                                                                { image: screenshot(boundingRect) }
                                                            );
                                                        }}
                                                    />
                                                </Popup>
                                            )}
                                            highlights={highlights}
                                        />
                                    )}
                                </PdfLoader>
                            </>
                        ) : state.files?.length === 0 ? (
                            <Container>
                                <div className="h3 text-center mt-5">No File Selected!!</div>
                            </Container>
                        ) : (
                            <Spinner />
                        )}
                    </div>
                    <PdfAutoScroller pdfHighlighter={pdfHighlighter} />
                </div>
            ) : (
                <TextEditor
                    id={state.auth?.userPublicId}
                    fileName={state.currentFile?.name}
                    showTextEditor={true}
                />
            )}
        </Wrapper>
    );
}

export default PdfViewer;


