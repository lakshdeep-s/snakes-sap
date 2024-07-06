import {fileURLToPath} from "url";
import {dirname} from "path";

function getRootDirectory(path) {
    return dirname(fileURLToPath(path));
}

export default getRootDirectory;