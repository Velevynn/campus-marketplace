module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ["eslint:recommended", "plugin:react/recommended"],
	overrides: [
		{
			env: {
				node: true
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script"
			}
		}
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	plugins: ["react"],
	rules: {
		"no-console": "off",
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-mixed-spaces-and-tabs": ["error", "smart-tabs"]
	},
	ignorePatterns: ["node_modules/", "dist/"],
	globals: {
		jQuery: "readonly",
		$: "readonly",
		React: "readonly",
		ReactDOM: "readonly",
		express: "readonly",
		indexing_v3: "readonly",
		multer: "readonly",
		upload: "readonly",
		router: "readonly",
		Pool: "readonly",
		dotenv: "readonly"
	}
};
