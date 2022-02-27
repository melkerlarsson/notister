module.exports = {
	"env": {
		"es2021": true,
		"node": true
	},
	"extends": [
		'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": './tsconfig.json',
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"react-hooks",
		"@typescript-eslint"
	],
	"rules": {
		'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
		"react/react-in-jsx-scope": "off",
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	},
	"settings": {
    "react": {
      "version": 'detect',
    }
  }
};
