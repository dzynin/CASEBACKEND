/* this is an attempt to cleanup FileViewer.js to externalise the components used within, not quite ready for use */


// import React from 'react';
// import processMd from '../Dashboard/markdown'; // Ensure this utility is correctly imported or adjusted

// const HighlightList = ({ highlights, currentHighlightIndex, onHighlightSelect }) => {
//     return (
//         <div className="sidebar__highlights" style={{ overflowY: "scroll", height: "100vh", position: "relative" }}>
//             {highlights.length > 0 ? (
//                 highlights.map((highlight, idx) => (
//                     <div
//                         className={`newcard ${idx === currentHighlightIndex ? 'active' : ''}`}
//                         key={idx}
//                         onClick={() => onHighlightSelect(idx)}
//                     >
//                         <div className="">
//                             <strong>{processMd(highlight.comment.text)}</strong>
//                             {highlight.content.text && (
//                                 <blockquote>{`${highlight.content.text.slice(0, 90).trim()}…`}</blockquote>
//                             )}
//                             {highlight.content.image && (
//                                 <div className="highlight__image" style={{ marginTop: "0.5rem" }}>
//                                     <img src={highlight.content.image} alt="Screenshot" />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="no-highlights">No Highlights Available for Selected Pdf!</div>
//             )}
//         </div>
//     );
// };

// export default HighlightList;
