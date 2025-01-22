// PdfAutoScroller.js
import React, { useEffect } from 'react';
import { useSocket } from '../shared/SocketContext'; // Use the context
import { viewportToScaled } from '../shared/coordinates_utils'; // Import the utility function


const PdfAutoScroller = ({ pdfHighlighter }) => {
    const socket = useSocket();

    useEffect(() => {
        const handleScrollTo = ({ bbox, page }) => {
            if (pdfHighlighter.current) {
                const highlight = {
                    position: {
                        boundingRect: bbox,
                        pageNumber: page,
                    }
                };

                pdfHighlighter.current.scrollTo(highlight);
            }
        };

        socket.on('auto-scroller-bbox-pass', handleScrollTo);

        return () => {
            socket.off('auto-scroller-bbox-pass', handleScrollTo);
        };
    }, [pdfHighlighter, socket]);

    return null;
};

export default PdfAutoScroller;
