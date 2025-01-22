import React from 'react';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const DocumentViewer = () => {
    // Define the document to be displayed
    const docs = [
        { uri: "/test.docx" }  // Local file stored in the public folder
    ];

    return (
        <div className="DOCVIEW" style={{ width: "100%", height: "500px" }}>
            <h2>Document Viewer</h2>
            <DocViewer 
                documents={docs} 
                pluginRenderers={DocViewerRenderers} 
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default DocumentViewer;
