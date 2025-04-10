// import { type Config } from "prettier";

// const config: Config = {
//   semi: true,
//   singleQuote: false,
//   tabWidth: 2,
//   trailingComma: "es5"
// };

const config = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",

  importOrder: [
    "^react$", // React imports first
    "<BUILTIN_MODULES>", // Built-in modules (e.g., fs, path)
    "<THIRD_PARTY_MODULES>", // External modules
    "^@/", // Internal modules (e.g., aliases starting with @)
    "^[./]", // Relative imports
  ],
  importOrderSeparation: true, // Add newlines between groups
  importOrderSortSpecifiers: true, // Alphabetize within import statements
  importOrderCaseInsensitive: true
};

export default config;