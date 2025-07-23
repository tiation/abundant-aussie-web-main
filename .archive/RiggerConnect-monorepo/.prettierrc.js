module.exports = {
  // Core formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  
  // Line handling
  printWidth: 100,
  endOfLine: 'lf',
  
  // Bracket handling
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // HTML/JSX specific
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  
  // Plugin configurations
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
