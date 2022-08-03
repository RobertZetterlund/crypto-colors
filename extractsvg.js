const fs = require("fs");
const path = require("path");

const SymbolToColorMap = {};

// Basically finds <circle ..... fill={color} />
const re = new RegExp(`(?<=circle)(.*?fill="(.*?)")(.*?)(?=\/>)`);

fs.readdir("./svg/", async (err, filenames) => {
  if (err) {
    throw err;
  }

  for (const filename of filenames) {
    const src = path.join(__dirname, `./svg/${filename}`);
    const svg = fs.readFileSync(src, "utf8");
    const match = svg.match(re)?.[2];
    if (match) {
      const color = match.replace(/['"]+/g, "");
      const symbol = filename.split(".")[0].toUpperCase();
      SymbolToColorMap[symbol] = color;
    }
  }
  const json = JSON.stringify(SymbolToColorMap);
  fs.writeFile("./symbolColors.json", json, "utf8", () => undefined);
});
