import React, { useState, useContext } from "react";
import { Fragment } from "react";
import { Input } from "reactstrap";

import { UserContext } from "../App";

function Search(props) {
	const { dispatch } = useContext(UserContext);
	const [searchQuery, setSearchQuery] = useState("");

	function handleFormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "SET_SEARCH_QUERY", payload: searchQuery });
	}

	function handleChange(e) {
		setSearchQuery(e.target.value);
	}

	return (
		<Fragment>
			{/* <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search" onSubmit={handleFormSubmit}>
				<Input
					type="text"
					className="form-control"
					placeholder="Search for caselaw or statue "
					value={searchQuery}
					onChange={handleChange}
				/>
			</form> */}
		</Fragment>
	);
}

export default Search;
