export const logger = {
  info: (msg: string) => {
    console.log(`[INFO] ${msg}`);
  },

  success: (msg: string) => {
    console.log(`[SUCCESS] ${msg}`);
  },

  warn: (msg: string) => {
    console.log(`[WARN] ${msg}`);
  },

  error: (msg: string) => {
    console.error(`[ERROR] ${msg}`);
  }
};