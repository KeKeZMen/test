import { readdir } from "fs/promises";
import { renameSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import sizeOf from "image-size";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, "/input");
const outputDir = join(__dirname, "/output");

const parseImages = async (newName) => {
  const files = await readdir(inputDir);

  for (let i = 0; i < files.length; i++) {
    const sizes = sizeOf(join(inputDir, files[i]));

    const ext = extname(files[i]);
    renameSync(
      join(inputDir, files[i]),
      join(
        outputDir,
        sizes.width >= sizes.height ? "/hor" : "/ver",
        newName + i + ext
      )
    );
  }
};

const main = async () => {
  await parseImages("РЧ");
};

main();
