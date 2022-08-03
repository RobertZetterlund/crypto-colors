var fs = require("fs");

const path = require("path");
const { extractColors } = require("extract-colors");
const { convertFile } = require("convert-svg-to-png");
const SymbolToColorMap = {};

fs.readdir("./svg/", async (err, filenames) => {
  if (err) {
    throw err;
  }

  fs.rmSync("./png", { recursive: true, force: true });
  fs.mkdir("./png", {}, () => console.info("Refresh png dir"));
  for (const filename of filenames) {
    const src = path.join(__dirname, `./svg/${filename}`);
    const copy = `${src}`;

    const pngSrc = copy.replace("/svg/", "/png/").replace(".svg", ".png");

    const png = await convertFile(src, {
      outputFilePath: pngSrc,
      width: 32,
      height: 32,
    });

    const symbol = filename.split(".")[0].toUpperCase();

    let colors = [];
    try {
      colors = await extractColors(png);
    } catch {
      // ok, idc
    }

    const hex = colors.find(
      // lets ignore white and black
      (c) => c.hex !== "#ffffff" && c.hex !== "#000000"
    )?.hex;
    SymbolToColorMap[symbol] = hex;
  }
  var json = JSON.stringify(SymbolToColorMap);
  fs.writeFile("./symbolColors.json", json, "utf8", console.info);

  // remove temporary pngs
  fs.rmSync("./icons/png/", { recursive: true, force: true });
  console.info("removed temporary pngs");
});
