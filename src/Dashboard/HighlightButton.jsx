import React, { useState, useContext } from "react";
import { Fragment } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { UserContext } from "../App";
import { BASE_URL_DEV } from "../utils";

function HighlightButton(props) {
  const { state, dispatch } = useContext(UserContext);
  const [hightlightResponse, setHightlightResponse] = useState("");

  async function saveHighlightData() {
    await axios
      .post(`${BASE_URL_DEV}/save-highlights`, state.fileHighlights, {
        headers: {
          "x-access-token": state.auth && state.auth.authToken,
        },
      })
      .then(function (response) {
        if (response.data) {
          dispatch({ type: "MESSAGE", payload: response.data.message });
          setHightlightResponse(response.data.message);
        }
      })
      .catch(function (error) {
        if (error.response) {
          dispatch({ type: "ERROR", payload: error.response.statusText });
          setHightlightResponse(
            error && error.response && error.response.statusText
          );
        }
      });
  }

  return (
    <Fragment>
      {/* <div className="highlight_btn">
        <Button
          className="btn btn-md"
          outline
          color="light"
          onClick={saveHighlightData}
        >
          Save Highlights
        </Button>
        <p>{hightlightResponse}</p>
      </div> */}
    </Fragment>
  );
}

export default HighlightButton;
