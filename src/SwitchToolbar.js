// import React from "react";
// import { Button, Spinner, InputGroup, FormControl } from "react-bootstrap";

// const SwitchToolbar = ({
//     loadingRecommendations,
//     loadingCaselaw,
//     loadingClause,
//     onRequest,
//     query,
//     setQuery,
//     onSend,
//     loadingSend
// }) => {
//     return (
//         <div className="d-flex justify-content-center align-items-center py-3 bg-secondary">
//             <Button variant="outline-light" className="mx-2" onClick={() => onRequest('recommendations')}>
//                 {loadingRecommendations ? <Spinner animation="border" size="sm" /> : "Insights"}
//             </Button>
//             <Button variant="outline-light" className="mx-2" onClick={() => onRequest('caselaw')}>
//                 {loadingCaselaw ? <Spinner animation="border" size="sm" /> : "Caselaw"}
//             </Button>
//             <Button variant="outline-light" className="mx-2" onClick={() => onRequest('clause')}>
//                 {loadingClause ? <Spinner animation="border" size="sm" /> : "Clause"}
//             </Button>

//             {/* Search Query Input */}
//             <InputGroup className="mx-3" style={{ maxWidth: "400px" }}>
//                 <FormControl
//                     placeholder="Ask AI a question..."
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                 />
//                 <Button variant="info" onClick={onSend}>
//                     {loadingSend ? <Spinner animation="border" size="sm" /> : "Send"}
//                 </Button>
//             </InputGroup>
//         </div>
//     );
// };

// export default SwitchToolbar;
