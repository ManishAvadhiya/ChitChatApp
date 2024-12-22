export const HOST = import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES = "/api/auth"
export const SIGNUP_ROUTES = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTES = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/userinfo`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateprofile`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/addprofileimage`
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/deleteprofileimage`
export const LOGOUT_USER_ROUTE = `${AUTH_ROUTES}/logout`

export const CONTACT_ROUTES = "/api/users"
export const SEARCH_USERS_ROUTE = `${CONTACT_ROUTES}/search`
export const GET_USERS_DM = `${CONTACT_ROUTES}/get-users-dm`
export const GET_ALL_USERS = `${CONTACT_ROUTES}/get-all-users`

export const MESSAGE_ROUTES = "/api/messages"
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/getmessages`
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`


export const CHANNEL_ROUTE = "/api/channels"
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/allChannels`
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTE}/channelmessages`