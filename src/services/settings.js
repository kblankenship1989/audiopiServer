
import {readFileSync, writeFile} from 'fs';
import {resolve} from 'path';

const filePath = resolve("../../public/settings.json");
const encoding = 'utf8';

const settingsRaw = readFileSync(filePath, encoding);
export const settings = JSON.parse(settingsRaw);

export const updateSetting = (key, value, callback) => {
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings), encoding, callback);
}