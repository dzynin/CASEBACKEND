/* this is an attempt to cleanup FileViewer.js to externalise the components used within, not quite ready for use */


// import React from 'react';
// import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// const HighlightControls = ({ onPrevious, onNext, onFilterChange }) => {
//     return (
//         <div className="highlight-actions">
//             <button className="btn btn-secondary" onClick={onPrevious}>Previous</button>
//             <UncontrolledDropdown>
//                 <DropdownToggle caret color="warning">
//                     Category
//                 </DropdownToggle>
//                 <DropdownMenu>
//                     <DropdownItem header>Jump to</DropdownItem>
//                     <DropdownItem onClick={() => onFilterChange("AXIOM")}>Axiom</DropdownItem>
//                     <DropdownItem onClick={() => onFilterChange("ISSUE")}>Issue</DropdownItem>
//                     <DropdownItem onClick={() => onFilterChange("LEGAL_TEST")}>Legal Test</DropdownItem>
//                     <DropdownItem onClick={() => onFilterChange("CONCLUSION")}>Conclusion</DropdownItem>
//                     <DropdownItem divider />
//                 </DropdownMenu>
//             </UncontrolledDropdown>
//             <button className="btn btn-primary" onClick={onNext}>Next</button>
//         </div>
//     );
// };

// export default HighlightControls;
