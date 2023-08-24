
import { generateCSVObject } from './csvGenerator';
import * as fs from 'fs';
import * as testData from './data.json';
import * as path from 'path';


function searchKey(obj: any, targetKey: string): any | undefined {
    for (const key in obj) {
      if (key === targetKey) {
        return obj[key];
      }
  
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedResult = searchKey(obj[key], targetKey);
        if (nestedResult !== undefined) {
          return nestedResult;
        }
      }
    }
  
    return undefined;
  }

  interface CSVObject {
    [key: string]: {
      schema: string;
      label: string;
      value: any;
    };
  }
  
const testjson = testData;

const keysToFetch = ['schema', 'data'];

const csvobj: CSVObject = generateCSVObject(testjson, keysToFetch);

console.log("csv object",csvobj)
const labels = Object.entries(csvobj).map(([key, obj]) => obj.label);
const values = Object.entries(csvobj).map(([key, obj]) => {
  let value;

  if (typeof obj.value === 'object') {
    const valueKeys = Object.keys(obj.value);
    if (valueKeys.includes(key)) {
      value = obj.value[key].toString();
    } else {
      value = valueKeys.join(', ');
    }
  } else {
    value = obj.value;
  }

  return value;
});

const rows = [labels, values];
const csvData = rows.map((row) => row.map((val) => `"${val}"`).join(',')).join('\n');


    const targetKey = 'frm_not_riyo_id';
const targetValue = searchKey(testData, targetKey);

const filenamecheck = `form_${targetValue}.csv`;
const rootFolderPath = path.join(__dirname, '..');

let fileFound = false;

function searchFile(directoryPath: string): void {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      searchFile(filePath); 
    } else if (file === filenamecheck) {
      fileFound = true;
      break;
    }
  }
}

// Search for the file in the entire project
searchFile(rootFolderPath);

// Check if the file was found
if (fileFound) {
  console.log(`File ${filenamecheck} exists in the project.`);
  const newData = `\n\n${csvData}`; // Add some space between the previous record and new data
  fs.appendFile(filenamecheck, newData, 'utf8', (err) => {
    if (err) {
      console.error('Error appending to CSV file:', err);
    } else {
      console.log(`Data has been appended to the existing CSV file: ${filenamecheck}`);
    }
  });
} else {
  console.log(`File ${filenamecheck} does not exist in the project.`);
  fs.writeFile(filenamecheck, csvData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log(`CSV file ${filenamecheck} has been successfully saved.`);
    }
  });
  }