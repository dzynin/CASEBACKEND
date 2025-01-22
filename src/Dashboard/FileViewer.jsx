// @flow
import React, { useContext, useState, useEffect } from "react";
// import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../App";
import { Resizable } from "react-resizable";
import processMd from "./markdown";
import axios from "axios";
import { BASE_URL_DEV } from "../utils";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {  faExclamationCircle, faPlus  } from '@fortawesome/free-solid-svg-icons';
// import {  faPlus  } from '@fortawesome/free-solid-svg-icons';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ChatUI from '../shared/Chatbox';

import "../style/resizable.css";

const updateHash = (highlight) => {
  document.location.hash = `pdf-highlight-${highlight.id}`;
};

function FileViewer() {
  const { state, dispatch } = useContext(UserContext);

  const [highlights, setHighlights] = useState([]);
  const [dimensions, setDimensions] = useState({
    height: 720,
    width: 300,
  });
  const [selectPdf, setSelectPdf] = useState(false);

  const [show, setShow] = useState(false);
  const [index, setIndex] = useState();
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const [totalHighlights, setTotalHighlights] = useState(0);
  const [highlightProgress, setHighlightProgress] = useState(0);

  const updateProgress = (currentIndex, total) => {
    setHighlightProgress(((currentIndex + 1) / total) * 100);
  };
  
  const handlePreviousHighlight = () => {
    const filteredHighlights = highlights.filter(h => h.comment.text.toUpperCase().includes(filter));
    if (filteredHighlights.length === 0) {
      alert(`No highlights available for '${filter}'`);
      return; // Early return to prevent further execution
    }
    const currentFilteredIndex = filteredHighlights.findIndex(h => h === highlights[currentHighlightIndex]);
    const prevIndex = (currentFilteredIndex - 1 + filteredHighlights.length) % filteredHighlights.length;
    const prevHighlight = filteredHighlights[prevIndex];
    setCurrentHighlightIndex(highlights.indexOf(prevHighlight));
    updateHash(prevHighlight);
    updateProgress(highlights.indexOf(prevHighlight), filteredHighlights.length);
    scrollToActiveCard(); // Ensuring the card scrolls into view
};

const handleNextHighlight = () => {
    const filteredHighlights = highlights.filter(h => h.comment.text.toUpperCase().includes(filter));
    if (filteredHighlights.length === 0) {
      return; // Early return to prevent further execution
    }
    const currentFilteredIndex = filteredHighlights.findIndex(h => h === highlights[currentHighlightIndex]);
    const nextIndex = (currentFilteredIndex + 1) % filteredHighlights.length;
    if (nextIndex === 0 && currentFilteredIndex === filteredHighlights.length - 1) {
      return;
    }
    const nextHighlight = filteredHighlights[nextIndex];
    setCurrentHighlightIndex(highlights.indexOf(nextHighlight));
    updateHash(nextHighlight);
    updateProgress(highlights.indexOf(nextHighlight), filteredHighlights.length);
    scrollToActiveCard(); // Ensuring the card scrolls into view
};

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  
    // Apply the new filter and get filtered highlights
    const filteredHighlights = highlights.filter(h =>
      newFilter === "" || h.comment.text.toUpperCase().includes(newFilter.toUpperCase())
    );
  
    // Set the total number of highlights which helps in calculating the progress
    setTotalHighlights(filteredHighlights.length);
  
    // Check if there are any highlights that match the new filter
    if (filteredHighlights.length > 0) {
      // Reset the index to start at the first highlight of the filtered list
      setCurrentHighlightIndex(highlights.indexOf(filteredHighlights[0]));
      // Update the progress for the new filtered list
      updateProgress(0, filteredHighlights.length);
      // Update the hash to jump to the first highlight of the new filter
      updateHash(filteredHighlights[0]);
    } else {
      // No highlights available for this filter
      setCurrentHighlightIndex(-1); // Indicates no selection
      setHighlightProgress(0); // Reset progress bar
      // Optionally revert to the first available highlight if no filter matches
      if (highlights.length > 0) {
        setCurrentHighlightIndex(0);
        updateHash(highlights[0]);
        updateProgress(0, highlights.length);
      } else {
        document.location.hash = ""; // Clear the hash as no valid highlight
        // alert(`No highlights available for '${newFilter}'`);
      }
    }
  };
  



  const handleClose = () => setShow(false);
  useEffect(() => {
    if (state.currentFile) {
      let highlightUpdated = false;
      const filteredHighlights = state.fileHighlights.reduce((acc, item) => {
        if (item.name === state.currentFile.name) {
          // Include only highlights that do not have the label "OTHER" and match the current filter (if any)
          const validHighlights = item.highlights.filter(highlight => 
            highlight.comment.text !== "OTHER" &&
            (!filter || highlight.comment.text.toUpperCase().includes(filter))
          );
          acc.push(...validHighlights);
          highlightUpdated = true;
        }
        return acc;
      }, []);
  
      setHighlights(filteredHighlights);
      if (!highlightUpdated || filteredHighlights.length === 0) {
        setHighlights([]); // Clear highlights if none match or file changes
      }
      setCurrentHighlightIndex(0); // Reset index to start at first of new filtered list or if file changes
    }
  }, [state.currentFile, state.fileHighlights, filter]);  // Dependency on filter ensures index reset on filter change
  
  const handleFileClick = async (index) => {
    dispatch({ type: "SET_CURR_FILE", payload: state.files[index] });
    dispatch({ type: "SET_MODAL", payload: false });

    setSelectPdf(false);
  };

  const handleRemove = (index) => {
    setShow(true);
    setIndex(index);
  }

  const handleRemoveFile = (data) => {
    console.log(data, "File Remove....")



    if (state.files.length > 0) {
      let arr = state.files
      arr.splice(arr.findIndex(a => a.name === data.name), 1)
      dispatch({ type: "ADD_FILE", payload: arr });
      dispatch({ type: "SET_CURR_FILE", payload: state.files[0] });
    } else {
      dispatch({ type: "ADD_FILE", payload: [] });
      dispatch({
        type: "SET_FILE_HIGHLIGHTS",
        payload: [],
      });
      dispatch({ type: "SET_CURR_FILE", payload: null });
    }


    setShow(false);


    axios.post(`${BASE_URL_DEV}/deletePdfAndGraphData`, { fileName: data.name }, {
      headers: {
        'x-access-token': state.auth && state.auth.authToken,
      }
    })
      .then(function (response) {
        console.log("delete api response", response)

      })

  }

  const deleteHighlight = (index) => {
    const updatedHighlights = highlights.filter((highlight, idx) => {
      if (index !== idx) {
        return highlight;
      }
    });
    setHighlights(updatedHighlights);
  };
  const hideModal = () => {
    setSelectPdf(false);
    dispatch({ type: "SET_MODAL", payload: false });

  }
  const resetHighlights = () => {
    setHighlights([]);
  };

  const handleSendToEditor = (highlight) => {
    if (!highlight.comment || !highlight.content) {
        console.error("Highlight structure is not as expected", highlight);
        return;
    }

    const payload = {
        commentText: highlight.comment.text,
        contentText: highlight.content.text,
    };
    dispatch({ type: 'ADD_HIGHLIGHT_TEXT', payload });
};

const handleWheel = (event) => {
  const delta = event.deltaY;
  event.preventDefault(); // Prevent default scrolling

  if (delta < 0) {
    handlePreviousHighlight();
  } else if (delta > 0) {
    handleNextHighlight();
  }
  scrollToActiveCard(); // Ensure the new active card is scrolled to view
};



const handleHighlightClick = (index) => {
  setCurrentHighlightIndex(index);
  updateHash(highlights[index]);
};


const scrollToActiveCard = () => {
  setTimeout(() => {
      const activeCard = document.querySelector('.newcard.active');
      if (activeCard) {
          activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
  }, 0);
};

// Call this function after updating the current highlight index
// setCurrentHighlightIndex(newIndex);
scrollToActiveCard();

return (
  <Resizable className="box" width={dimensions.width} onResize={(e, { size }) => setDimensions({ width: size.width })} resizeHandles={["e"]}>
      <div className="sidebarnew" style={{ width: "36vw" }}>

          {/* Progress Bar */}
          <div className="progress-container" style={{ width: '100%', backgroundColor: '#222d37', height: '1vh', margin: '1vh 0' }}>
              <div className="progress-bar" style={{ width: `${highlightProgress}%`, height: '5px', backgroundColor: '#2e5f8a' }}></div>
          </div>

          {/* Navigation and Filtering */}
          <div className="highlight-actions">
              <button className="btn btn-secondary" onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousHighlight();
              }}>Previous</button>

              <UncontrolledDropdown>
                  <DropdownToggle caret color="warning">
                      Category
                  </DropdownToggle>
                  <DropdownMenu>
                      <DropdownItem header>Jump to</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange("AXIOM")}>Axiom</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange("ISSUE")}>Issue</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange("LEGAL_TEST")}>Legal Test</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange("CONCLUSION")}>Conclusion</DropdownItem>
                      <DropdownItem divider />
                  </DropdownMenu>
              </UncontrolledDropdown>

              <button className="btn btn-primary" onClick={(e) => {
                  e.stopPropagation();
                  handleNextHighlight();
              }}>Next</button>
          </div>

          {/* Highlight cards within a scrollable container */}
          <div className="sidebar__highlights" onWheel={handleWheel} style={{ overflowY: "scroll", height: "calc(17vh)", position: "relative" }}>
              {highlights.length > 0 ? highlights.map((highlight, idx) => (
                  <div className={`newcard ${idx === currentHighlightIndex ? 'active' : ''}`} key={idx} onClick={() => handleHighlightClick(idx)}>
                      <div>
                          <strong>{processMd(highlight.comment.text)}</strong>
                          {highlight.content.text && (
                              <blockquote>{`${highlight.content.text.slice(0, 90).trim()}…`}</blockquote>
                          )}
                          {highlight.content.image && (
                              <div className="highlight__image" style={{ marginTop: "0.5rem" }}>
                                  <img src={highlight.content.image} alt="Screenshot" />
                              </div>
                          )}
                      </div>
                  </div>
              )) : (
                  <div className="no-highlights">No Highlights!</div>
              )}
          </div>

          {/* Summary Card Section */}
          {/* <div className="description" style={{ padding: "1rem" }}> */}
          <div className="description">

              {/* <div className="summary-section"><h2>Summary</h2></div>
              <div className="highlight-card" key={currentHighlightIndex}>
                  <div className="card-body">
                      <strong> Details Here</strong>
                      <blockquote>This is an example of some summary text that could be here.</blockquote>
                  </div>
              </div> */}


        {/* <ChatUI /> */}
        <ChatUI publicId={state.auth.userPublicId} pdfDocumentName={state.currentFile && state.currentFile.name} />

          </div>

      </div>
  </Resizable>
);

}

export default FileViewer;