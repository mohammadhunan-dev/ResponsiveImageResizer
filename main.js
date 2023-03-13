const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const inputPath = "input.png";
const outputDir = "output";
const outputSizes = [1024, 640, 320];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function convertImage(inputPath, outputPath, outputWidth) {
  const inputBuffer = await fs.promises.readFile(inputPath);
  const { width, height } = await sharp(inputBuffer).metadata();
  const outputHeight = Math.round(outputWidth / (width / height));
  const outputBuffer = await sharp(inputBuffer)
    .resize(outputWidth, outputHeight, { fit: "contain" })
    .webp({ lossless: true })
    .toBuffer();
  await fs.promises.writeFile(outputPath, outputBuffer);
}

(async function () {
  for (const outputWidth of outputSizes) {
    const outputName = `${path.basename(
      inputPath,
      path.extname(inputPath)
    )}_${outputWidth}w.webp`;
    const outputPath = path.join(outputDir, outputName);
    await convertImage(inputPath, outputPath, outputWidth);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  }
})();
