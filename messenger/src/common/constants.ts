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
export const MSG_FIELD_REQUIRED = '*Field required*';
export const MSG_USERNAME_TAKEN = '*This Username already exists*';
export const MSG_EMAIL_TAKEN = '*This email already exists*';
export const MSG_NAMES_LENGTH = '*Must be 4 to 32 characters*';
export const MSG_EMAIL_INVALID = '*Invalid email format*';
export const MSG_LOGIN_UNABLE = '*Wrong username or password*';
export const MSG_PASSWORD_LENGTH = '*Password length must be more than 6 characters*';
export const MSG_PASSWORD_NOT_MATCH = '*Password fields do not match*';
export const MSG_INVALID_IMAGE_FORMAT = '*Invalid image format*';

// Search users types
export const START_CHAT = 'START_CHAT';
export const ADD_USERS = 'ADD_USERS';

// Show Navbar Teams or Messages
export const SIDEBAR_SHOW_MESSAGES = 'SIDEBAR_SHOW_MESSAGES';
export const SIDEBAR_SHOW_TEAMS = 'SIDEBAR_SHOW_TEAMS';

//title of team or channel validations
export const TITLE_NAME_LENGTH_MIN: number = 3;
export const TITLE_NAME_LENGTH_MAX: number = 40;

//type of message
export const USER_MESSAGE = 'user message';
export const REPLY = 'reply';
export const ADDED = 'added ';
export const ADMIN = 'admin';
export const ADD_PERSON = 'add person';
export const TO = ' to ';
export const REMOVE_PERSON = 'remove person';
export const REMOVED = 'removed ';
export const FROM = ' from ';
export const LEFT = 'left ';

//more option menu
export const TEAM_MORE_OPTIONS = [
  { title: 'Add channel', function: 'addChannel', icon: 'FiUsers' },
  { title: 'Add/Remove members', function: 'addOrRemoveNewMember', icon: 'FiUsers' },
  { title: 'Edit team information', function: 'editTeamInformation', icon: 'FiEdit3' },
  { title: 'Remove team', function: 'removeTeam', icon: 'FiXOctagon' }
]
export const CHAT_MESSAGE_MORE_OPTIONS = [];