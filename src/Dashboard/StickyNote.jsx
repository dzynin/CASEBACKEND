import React from 'react';
// import '../style/StickyNote.css'; // Make sure the path to your CSS file is correct

function StickyNote({ isScrolledTo, position, comment }) {
    // Assuming the PDF viewer container has a specific class or ID
    const pdfViewer = document.querySelector('.pdf-viewer'); // Adjust the selector as needed

    // Calculate 5% of the PDF viewer's width
    const offset = pdfViewer ? pdfViewer.clientWidth * 0.004 : 0;

    // Adjust the styling to start at 5% offset of the PDF viewer's width
    const style = {
        position: 'absolute',
        left: `${offset}px`, // Start from 5% of the PDF viewer's width
        top: `${position.boundingRect.top}px`,
        background: 'yellow',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '10 2px 5px rgba(0,0,0,0.3)',
        zIndex: 1000  // Ensure it appears above other elements
    };

    return (
        <div style={style}>
            {comment && comment.text}
        </div>

    //     <div className="sticky-content">
    //     {comment && comment.text}
    // </div>


    );
}

export default StickyNote;
