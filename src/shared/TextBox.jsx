import React from 'react';
import { Form } from 'react-bootstrap';
import { TextField } from '@material-ui/core';
import FloatingLabel from "react-bootstrap-floating-label";

const TextBox = ({text,setText}) => (
    // <>
    // <FloatingLabel controlId="floatingTextarea" label="Comments" className="mb-3">
    //   <Form.Control as="textarea" placeholder="Leave a comment here" />
    // </FloatingLabel>
    // <FloatingLabel controlId="floatingTextarea2" label="Comments second">
      <TextField
        as="textarea"
        placeholder="Leave a comment here"
        style={{ height: '100px' }}
        value={text}
        onChange={e => setText(e.target.value)}
      />
  //   </FloatingLabel>
  // </>


)




export default TextBox;
