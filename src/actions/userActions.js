import {
    loginFail,
    loginRequest, 
    loginSuccess, 
    clearError,
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
} from '../slices/authSlice';

import {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail

} from '../slices/userSlice';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    console.log("Sending login request...");

    const { data } = await axios.post(
      "http://localhost:8000/api/v1/login",
      { email, password },
      {
        withCredentials: true   // ⭐ REQUIRED
      }
    );

    console.log("Login response:", data);

    dispatch(loginSuccess(data));

  } catch (error) {
    console.log("Login error:", error.response);

    dispatch(
      loginFail(
        error.response?.data?.message || "Login failed"
      )
    );
  }
};

export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
}

export const register = (userData) => async (dispatch) => {

    try {
        dispatch(registerRequest())
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const { data }  = await axios.post(`http://localhost:8000/api/v1/register`,userData, config);
        dispatch(registerSuccess(data))
    } catch (error) {
        //console.log("Register error:", error.response.data.message);
        dispatch(registerFail(error.response.data.message))
    }

}

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    console.log("Calling /myprofile...");

    const { data } = await axios.get(
      "http://localhost:8000/api/v1/myprofile",
      {
        withCredentials: true
      }
    );

    console.log("User Loaded:", data);

    dispatch(loadUserSuccess(data));

  } catch (error) {
    console.log("Load user error:", error.response);

    dispatch(
      loadUserFail(
        error.response?.data?.message || "User load failed"
      )
    );
  }
};


export const logout = () => async (dispatch) => {
    try {
        await axios.get(`http://localhost:8000/api/v1/logout`);

        dispatch(logoutSuccess());

    } catch (error) {
        dispatch(logoutFail(error.response?.data?.message));
    }
};

export const updateProfile = (userData) => async (dispatch) => {

    try {
        console.log("🚀 Dispatching updateProfileRequest");
        dispatch(updateProfileRequest());

        const config = {
            withCredentials: true, // ✅ Correct placement
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        console.log("📤 Sending userData:", userData);

        const response = await axios.put(
            `http://localhost:8000/api/v1/update`,
            userData,
            config
        );

        console.log("✅ Full Axios Response:", response);
        console.log("✅ Response Data:", response.data);

        dispatch(updateProfileSuccess(response.data));

    } catch (error) {

        console.log("❌ Axios Error Object:", error);
        console.log("❌ error.response:", error.response);
        console.log("❌ error.response?.data:", error.response?.data);

        const message =
            error.response?.data?.message ||
            error.message ||
            "Unknown error";

        dispatch(updateProfileFail(message));
    }
};

export const updatePassword = (formData) => async (dispatch) => {

    try {
        dispatch(updatePasswordRequest());

        const config = {
            withCredentials: true   // ⭐⭐⭐ REQUIRED
        };

        await axios.put(
            `http://localhost:8000/api/v1/password/change`,
            formData,
            config
        );

        dispatch(updatePasswordSuccess());

    } catch (error) {

        const message =
            error.response?.data?.message ||
            error.message;

        dispatch(updatePasswordFail(message));
    }
};

export const forgotPassword = (formData) => async (dispatch) => {

    try {
        dispatch(forgotPasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        const { data} =  await axios.post(`http://localhost:8000/api/v1/password/forgot`, formData, config);
        dispatch(forgotPasswordSuccess(data))
    } catch (error) {
        dispatch(forgotPasswordFail(error.response.data.message))
    }

}

export const resetPassword = (formData, token) => async (dispatch) => {

    try {
        dispatch(resetPasswordRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log("📤 Reset payload:", formData);
        console.log("🔑 Token:", token);

        const response = await axios.post(
            `http://localhost:8000/api/v1/password/reset/${token}`,
            formData,
            config
        );

        console.log("✅ Reset response:", response);

        dispatch(resetPasswordSuccess(response.data));

    } catch (error) {

        console.log("❌ Reset error:", error);
        console.log("❌ error.response:", error.response);

        const message =
            error.response?.data?.message ||
            error.message ||
            "Reset failed";

        dispatch(resetPasswordFail(message));
    }
}

export const getUsers =  async (dispatch) => {

    try {
        dispatch(usersRequest())
        const { data }  = await axios.get(`http://localhost:8000/api/v1/admin/users`);
        dispatch(usersSuccess(data))
    } catch (error) {
        dispatch(usersFail(error.response.data.message))
    }

}

export const getUser = id => async (dispatch) => {

    try {
        dispatch(userRequest())
        const { data }  = await axios.get(`http://localhost:8000/api/v1/admin/user/${id}`);
        dispatch(userSuccess(data))
    } catch (error) {
        dispatch(userFail(error.response.data.message))
    }

}

export const deleteUser = id => async (dispatch) => {

    try {
        dispatch(deleteUserRequest())
        await axios.delete(`http://localhost:8000/api/v1/admin/user/${id}`);
        dispatch(deleteUserSuccess())
    } catch (error) {
        dispatch(deleteUserFail(error.response.data.message))
    }

}

export const updateUser = (id, formData) => async (dispatch) => {

    try {
        dispatch(updateUserRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        await axios.put(`http://localhost:8000/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess())
    } catch (error) {
        dispatch(updateUserFail(error.response.data.message))
    }

}