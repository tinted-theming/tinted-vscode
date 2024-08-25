import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config({
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",
    },
    plugins: {
        "@typescript-eslint": typescriptEslint
    },
    rules: {
        "@typescript-eslint/naming-convention": [
            "warn",
            {
                selector: "import",
                format: ["camelCase", "PascalCase"]
            }
        ],
        curly: "warn",
        eqeqeq: "warn",
        "no-throw-literal": "warn",
        semi: "off"
    },
    ignores: [
        "out",
        "dist",
        "**/*.d.ts"
    ]
})
