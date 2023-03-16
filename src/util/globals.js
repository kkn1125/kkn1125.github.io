export const API_PROTOCOL = process.env.GATSBY_API_PROTOCOL;
export const API_HOST = process.env.GATSBY_API_HOST;
export const API_PORT = process.env.GATSBY_API_PORT;

export const API_PATH = API_PROTOCOL + "://" + API_HOST + ":" + API_PORT;
export const API_BASE_PATH = process.env.GATSBY_API_BASE_PATH;
export const SECRET_KEY = process.env.GATSBY_SECRET_KEY;
