export const updateState = (state, updateValues) => ({
	...state, ...updateValues,
});

export const updateHighlightStatus = (state, updateValues) => {
	const newState = { ...state, highlightColors: updateValues }
	localStorage.setItem("highlightColors", JSON.stringify(newState.highlightColors))
	return newState
}

