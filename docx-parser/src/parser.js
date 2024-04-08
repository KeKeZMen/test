import { readdir, stat, appendFile, copyFile } from "fs";
import { extname } from "path";
import { rusToLat } from "ruslat";

const readFrom = "src/input";
const parsedDataFile = "src/parsed.json";
const outputDir = "src/output";

let counter = 0;

const parseFileName = (fileName) => {
  const symbols = ["»", "«", "(", ")", "+", ","];
  
  return rusToLat(fileName
    .split("")
    .map(char => char == " " ? char.replace(char, "-") : symbols.includes(char) ? char.replace(char, "") : char)
    .map((char, index) => char == "-" && char[index + 1] == "-" && char[index + 1] == char ? char.splice(index, 1) : char)
    .join("")
    .toLowerCase());
};

const actionWithFile = (readFrom, file) => {
  const parsedFileName = parseFileName(readFrom.split("/")[3] + "-" + file);

  let readyToInsertString = ""
  if(extname(readFrom + "/" + file) == ".docx") readyToInsertString = `<div class='wp-block-embedpress-document embedpress-document-embed ep-doc-embedpress-pdf-1682337449365' style='height:1000px;width:1000px'><iframe style='height:1000px;width:1000px' src='//view.officeapps.live.com/op/embed.aspx?src=https://rkcmo.ru/wp-content/uploads/2023/04/${parsedFileName}' mozallowfullscreen='true' webkitallowfullscreen='true'></iframe><p class='embedpress-el-powered'>Powered By EmbedPress</p></div>`;
  else readyToInsertString = `[embedpress_pdf]https://rkcmo.ru/wp-content/uploads/2023/04/${parsedFileName}[/embedpress_pdf]`;

  const fileData = {
    path: `${readFrom + "/" + file}`,
    categoryName: `\\\\\\${readFrom.split("/")[3]}///`,
    name: file,
    parsedName: parsedFileName,
    parsed: readyToInsertString
  };

  appendFile(parsedDataFile, `${JSON.stringify(fileData)},`, (err, result) => {
    if (err) throw err;
    counter++;
    console.log(counter);
  });
  
  copyFile(readFrom + "/" + file, outputDir + "/" + parsedFileName, (err, result) => {
    if(err) throw err
    counter--
    console.log(counter);
  });
};

const listOfFiles = (readFrom) => {
  try {
    readdir(readFrom, (err, files) => {

      if (err) throw Error;

      for (let file of files) {
        stat(readFrom + "/" + file, (err, stats) => {
          if (err) throw Error;

          if (stats.isDirectory()) listOfFiles(readFrom + "/" + file);

          if (stats.isFile() && extname(readFrom + "/" + file) == ".docx" || extname(readFrom + "/" + file) == ".pdf") actionWithFile(readFrom, file);
        });
      };

      console.log(counter);
    });
  } catch (error) {
    console.log(error);
  };
};

listOfFiles(readFrom)
// https://rkcmo.ru/wp-content/uploads/2023/04/3d-modelirovanije-dlya-kompjuternyx-igr-konkursnoje-zadanije.docx
// https://rkcmo.ru/wp-content/uploads/2023/04/3d-modelirovanije-dlya-kompjuternyx-igr-konkursnoje-zadanije.docx