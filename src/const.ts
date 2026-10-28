import { version } from '../package.json';

// semantic-release bumps package.json and rebuilds, so the banner always shows the released version
export const CARD_VERSION = `v${version}`;
