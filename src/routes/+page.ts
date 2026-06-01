// Render client-side only so the persisted (localStorage) format is correct on
// the first paint — server rendering would always emit the default and flash.
export const ssr = false
