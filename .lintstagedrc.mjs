export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,yml,yaml,css,md}": ["prettier --write"],
};
