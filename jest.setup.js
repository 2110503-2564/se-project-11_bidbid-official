// import '@testing-library/jest-dom/extend-expect'
// const { TextEncoder, TextDecoder } = require("util");

// Object.assign(global, { TextDecoder, TextEncoder });

import { TextDecoder, TextEncoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;