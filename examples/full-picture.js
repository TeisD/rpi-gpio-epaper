/**
 * Incomplete example from https://gist.github.com/dbushell/dd36bef27ffd278140516151b1ed365c
 */

const fs = require('fs');
const PNG = require('pngjs').PNG;
const EPD = require('rpi-gpio-epaper');

function readImage(imagePath) {
  return new Promise((resolve, reject) => {
    fs
      .createReadStream(imagePath)
      .pipe(new PNG())
      .on('parsed', function() {
        const image = EPD.createImage(this.width, this.height);
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            image.view[y].writeUInt8(
              EPD.toUInt8(
                this.data[(this.width * y + x) << 2] > 128 ? 0xff : 0x00
              ),
              x,
              1
            );
          }
        }
        resolve(image);
      });
  });
}

async function run() {
  const epd = new EPD({
    model: {
      /* ...model constants */
    }
  });
  await epd.init();
  const image = await readImage(picPath);
  const data = EPD.getImageRAM(image);
  await epd.writeDisplayFull(data);
  await epd.exit();
}

run();
