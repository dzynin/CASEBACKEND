
import React, { useState, useEffect, useContext  } from "react";
import { UserContext } from "../App";

function Highlight(props) {
  const {state} = useContext(UserContext);
  const [nodeData, setNodeData] = useState({})

useEffect(() => {
  setNodeData(state.nodeData)
}, [state.nodeData]);

  return (
    <div className="sidebarnew"style={{ width: "25vw" }}>
      {/*  */}
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" , fontSize:"1.2rem"}}>Name</h2>
        <p>{nodeData.name}</p>
        {/* <div dangerouslySetInnerHTML={{ __html: nodeData.preview && nodeData.preview.join("") }} /> */}
        
      </div>

      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" , fontSize:"1.2rem"}}>Preview</h2>

        <div dangerouslySetInnerHTML={{ __html: nodeData.preview && nodeData.preview.join("") }} />
        
      </div>
    </div>
  );
}

export default Highlight;
