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

//post validations
export const POST_TITLE_LENGTH_MIN = 16;
export const POST_TITLE_LENGTH_MAX = 64;
export const POST_CONTENT_LENGTH_MIN = 32;
export const POST_CONTENT_LENGTH_MAX = 8192;

//constants for latest and more comment
export const LATEST_COUNT = 9;
export const MOST_COMMENT_COUNT = 9;

//sort by
export const ASCENDING = 'ascending';
export const DESCENDING = 'descending';
export const THE_LATEST = 'latest';
export const THE_MOST_COMMENT = 'mostComment';
export const THE_MOST_LIKED = 'theMostLiked';
export const TITLE_SORT_BY_A_Z = 'titleAZ';
export const TITLE_SORT_BY_Z_A = 'titleZA';