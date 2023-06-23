import api from 'src/api/Api';

const Reducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'LOGIN':
            api.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
            localStorage.setItem("token", payload.token);
            localStorage.setItem("user", JSON.stringify(payload.user));
            return {
                ...state,
                token: payload.token,
                user: payload.user
            };
        case 'LOGIN_FAIL':
            return {
                ...state,
                token: null,
                user: null,
                errorMessage: "Login failed"
            };
        case 'LOGOUT':
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null
            };
        case 'UPDATE_USER':
            localStorage.setItem("user", JSON.stringify(payload.user));
            return {
                ...state,
                user: payload.user
            };
        case 'CHANGE_PASSWORD':
            api.defaults.headers.common['Authorization'] = `Token ${payload.token}`;
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                token: payload.token
            };
        default:
            return state;
    }
};

export default Reducer;
