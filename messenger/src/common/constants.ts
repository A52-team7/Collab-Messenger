export const USERS = 'Users';
export const POSTS = 'Posts';
export const USERNAME = 'username';
export const EMAIL = 'email';
export const HANDLE = 'handle';

// form validators
export const NAMES_LENGTH_MIN = 4;
export const NAMES_LENGTH_MAX = 32;
export const PHONE_NUMBER_LENGTH_MAX = 10;
export const PASSWORD_LENGTH_MIN = 6;
export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

// form error messages
export const MSG_FIELD_REQUIRED = 'Field required';
export const MSG_USERNAME_TAKEN = 'This Username already exists';
export const MSG_EMAIL_TAKEN = 'This email already exists';
export const MSG_NAMES_LENGTH = 'Must be 4 to 32 characters';
export const MSG_EMAIL_INVALID = 'Invalid email format';
export const MSG_LOGIN_UNABLE = 'Wrong username or password';

//team validations
export const TEAM_NAME_LENGTH_MIN: number = 3;
export const TEAM_NAME_LENGTH_MAX: number = 40;
