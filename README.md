# Base16 for Visual Studio Code

See the [Base16 repository](https://github.com/chriskempson/base16) for more info.

## Usage

```
npm install --global base16-builder
```

To build themes 
```
base16-builder
```

To convert themes to monaco compatible format use
[monaco-vscode-textmate-theme-converter](https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter).

Replace `inherit: false` to `inherit: true` and set `"base": "vs"` for light themes.
