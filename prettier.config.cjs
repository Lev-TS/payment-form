/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
