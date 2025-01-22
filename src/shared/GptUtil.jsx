import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { fetchAuth } from "../utils";
import { UserContext } from "../App";
// import React, { useContext, useEffect } from 'react';

const ENDPOINT_URL = "http://localhost:8000/generate";

const useAsyncEndpoint = fn => {
    const [res, setRes] = React.useState({ data: null, complete: false, pending: false, error: false });
    const [req, setReq] = React.useState();
    const { state, dispatch } = useContext(UserContext);

    React.useEffect(() => {
        if (!req) return;
        setRes({ data: null, pending: true, error: false, complete: false });
        if (state && state.auth) {
			const auth = state.auth;
            console.log(req.data)
            axios.post(req.url, req.data, {
                headers: {
                    "x-access-token": auth.authToken,
                },
            })
                .then(res =>
                    setRes({ data: res.data.result, pending: false, error: false, complete: true })
                )
                .catch(() =>
                    setRes({ data: null, pending: false, error: true, complete: true })
                );
        }}, [req]);

    return [res, (...args) => setReq(fn(...args))];
}

export const postGenerateTextEndpoint = () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    return useAsyncEndpoint(data => ({ url: ENDPOINT_URL, method: "POST", data }));
}