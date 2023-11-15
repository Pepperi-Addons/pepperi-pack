import { IClientZipFilesData, ISymlinkFilesData } from 'shared';
import { AddonUUID } from "../addon.config.json";
import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);
const symlink = util.promisify(fs.symlink);

class ClientZipService {

    constructor(private addonVersion: string) {
    }

    /***********************************************************************************************/
    /*                                  Public functions
    /***********************************************************************************************/

    // Create the symlink files in the client zip folder.
    async createSymlinksFiles(relativePath: string): Promise<void> {
        const baseUrl = await pepperi.files.baseURL(); // file://localhost:8088/files

        // Read file from path and read the data into fileData variable.
        const fileData = await readFile(`${baseUrl}${relativePath}/addon_package.json`, 'utf8');
        const clientZipData: IClientZipFilesData = JSON.parse(fileData);
        // let clientZipData: IClientZipData = file { Symlinks: [] };

        if (clientZipData && clientZipData.Symlinks) {
            for (let index = 0; index < clientZipData.Symlinks.length; index++) {
                const symlinkData: ISymlinkFilesData = clientZipData.Symlinks[index];

                if (symlinkData.ExludedFileName && symlinkData.ExludedFileName.length > 0) {
                    const symlinkName = symlinkData.ExludedFileName;
                    const symlinkTargetPath = `${baseUrl}/Addon/Public/${AddonUUID}/${this.addonVersion}/${symlinkName}`; // symlink.RelativePathToOriginal.replace(AddonVersionString, AddonVersion);
                    const symlinkPath = `${baseUrl}${relativePath}/${symlinkName}`;

                    try {
                        await symlink(symlinkTargetPath, symlinkPath);
                    } catch (err) {
                        console.error(`Symlink creation failed: ${ err}`);
                        throw new Error(`Symlink creation failed: ${ err}`);
                    }
                }
            }
        }
    }
}
export default ClientZipService;
