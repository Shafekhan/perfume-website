import * as types from "./authActionType";
import { BrowserProvider } from "ethers";
import axios from "axios";
const auth_url = import.meta.env.VITE_BASE_URL;

const userSignupActionFn = (creds) => (dispatch) => {
  dispatch({ type: types.USER_SIGNUP_REQUEST });
  return axios
    .post(`${auth_url}/user/signup`, creds)
    .then((res) => {
      return dispatch({ type: types.USER_SIGNUP_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      return dispatch({
        type: types.USER_SIGNUP_FAILURE,
        payload: err.response.data.message,
      });
    });
};

// Login
const userLoginActionFn = (creds) => (dispatch) => {
  dispatch({ type: types.USER_LOGIN_REQUEST });
  return axios
    .post(`${auth_url}/user/login`, creds)
    .then((res) => {
      return dispatch({
        type: types.USER_LOGIN_SUCCESS,
        payload: res.data.user,
      });
    })
    .catch((err) => {
      console.log("erraction: ", err.response.data);
      return dispatch({
        type: types.USER_LOGIN_FAILURE,
        payload: err.response.data.message,
      });
    });
};

const userLogoutActionFn = () => (dispatch) => {
  return dispatch({ type: types.USER_LOGOUT_REQUEST });
};

const metamaskLoginActionFn = () => async (dispatch) => {
  dispatch({ type: types.USER_LOGIN_REQUEST });

  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress(); // works in v6

    const nonceRes = await axios.post(`${auth_url}/user/nonce`, { walletAddress: address });
    const nonce = nonceRes.data.nonce;

    const signature = await signer.signMessage(nonce);

    const verifyRes = await axios.post(`${auth_url}/user/metamask-login`, {
      walletAddress: address,
      signature,
    });

    localStorage.setItem("user", JSON.stringify(verifyRes.data.user));
    dispatch({ type: types.USER_LOGIN_SUCCESS, payload: verifyRes.data.user });

    return { type: types.USER_LOGIN_SUCCESS };
  } catch (err) {
    console.error("MetaMask login error:", err.response?.data || err.message);
    dispatch({
      type: types.USER_LOGIN_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    return { type: types.USER_LOGIN_FAILURE, payload: err.message };
  }
};

export { userSignupActionFn, userLoginActionFn, userLogoutActionFn, metamaskLoginActionFn };
