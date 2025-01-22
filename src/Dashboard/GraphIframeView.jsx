// GraphIframeView.js
import React from 'react';

function GraphIframeView({ url }) {
    if (!url) return null;

    return (
        <div className="iframe-container">
            <iframe src={url} title="Node Content" width="100%" height="600px" />
        </div>
    );
}

export default GraphIframeView;
