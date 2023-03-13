const sharp = require("sharp");
const fs = require("fs");

const inputPath = "input.png";
const outputPathBase = "output";

// Define the desired output sizes
const outputSizes = [
  { width: 1024, height: 768 },
  { width: 640, height: 480 },
  { width: 320, height: 240 },
];

// Read the input image
sharp(inputPath)
  .webp({ lossless: true })
  .toBuffer()
  .then((outputBuffer) => {
    // Loop through the desired output sizes
    outputSizes.forEach((size, index) => {
      // Calculate the output filename based on the output size and index
      const outputFilename = `${outputPathBase}-${size.width}x${size.height}-${index}.webp`;

      // Calculate the output width and height while maintaining the original aspect ratio
      const { width, height } = sharp(inputPath).metadata();
      const aspectRatio = width / height;
      const outputWidth = size.width;
      const outputHeight = Math.round(outputWidth / aspectRatio);

      // Resize the image and write it to the output file
      sharp(outputBuffer)
        .resize(outputWidth, outputHeight)
        .toFile(outputFilename, (err) => {
          if (err) {
            console.error(
              `Error writing output file ${outputFilename}: ${err}`
            );
          } else {
            console.log(`Successfully wrote output file ${outputFilename}`);
          }
        });
    });
  })
  .catch((err) => {
    console.error(`Error processing input file ${inputPath}: ${err}`);
  });
