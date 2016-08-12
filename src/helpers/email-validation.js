// From Hybris codebase
const LOCAL = '(?!\\.)(?=.*[^\\.]@)[a-zA-Z0-9!#$%&\\;\'*+/=?^_`.{|}~-]{1,64}';
const HOSTNAME_START = '[a-zA-Z0-9]';
const HOSTNAME_BODY = '[a-zA-Z0-9-\\.]{0,253}';
const HOSTNAME_END = '[a-zA-Z0-9]*(\\.[A-Za-z0-9]+)'; // check for . validation
const HOSTNAME = `${HOSTNAME_START}${HOSTNAME_BODY}${HOSTNAME_END}`;
const IPV4_DOMAIN = '\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\]';
// Minimum IPV6 address would be :: (mean 0:0:0:0:0:0:0:0)
const IPV6_DOMAIN = '\\[(I|i)(P|p)(V|v)6([0-9a-z]{0,4}:){2,7}[0-9a-z]{0,4}\\]';
const IP_DOMAIN = `${IPV4_DOMAIN}|${IPV6_DOMAIN}`;

const EMAIL = `^${LOCAL}@(${HOSTNAME}|${IP_DOMAIN})$`;

export const EMAIL_VALIDATOR = new RegExp(EMAIL);
