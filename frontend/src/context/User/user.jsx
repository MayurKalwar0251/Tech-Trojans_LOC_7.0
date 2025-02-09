import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../../constant";

export const getUserDetails = async (
  setIsAuthen,
  setUser,
  setLoading,
  setError
) => {
  try {
    setLoading(true);

    // Get token from cookies
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    console.log("token,role", token, role);

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    // Send request with Authorization header

    const url = `${BACKEND_URL}/user/citizen`;

    const response = await axios.get(
      role == "citizen" ? url : `${BACKEND_URL}/user/`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
      }
    );

    if (response.data.user) {
      setIsAuthen(true);
      setUser(response.data.user);
      console.log(response.data);
    }
  } catch (error) {
    setError(error.response?.data?.message || error.message);
    console.error("Error fetching user details:", error);
  } finally {
    setLoading(false);
  }
};

export const getPoliceMembersDetails = async (
  setIsAuthen,
  setUser,
  setLoading,
  setError
) => {
  try {
    setLoading(true);

    // Get token from cookies
    const token = Cookies.get("token");

    console.log(token);

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    // Send request with Authorization header
    const response = await axios.get(`${BACKEND_URL}/user/citizen/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    if (response.data.user) {
      setIsAuthen(true);
      setUser(response.data.user);
      console.log(response.data);
    }
  } catch (error) {
    setError(error.response?.data?.message || error.message);
    console.error("Error fetching user details:", error);
  } finally {
    setLoading(false);
  }
};
