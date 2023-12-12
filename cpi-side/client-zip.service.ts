import { IClientZipFilesData, ISymlinkFilesData } from 'shared';
import { AddonUUID } from "../addon.config.json";
import fs from 'fs';
import util from 'util';

const existFile = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const symlink = util.promisify(fs.symlink);

class ClientZipService {

    constructor(private addonVersion: string) {
    }

    /***********************************************************************************************/
    /*                                  Public functions
    /***********************************************************************************************/

    // // Create the symlink files in the client zip folder.
    // async createSymlinksFiles(relativePath: string): Promise<void> {
    //     const baseUrl = await pepperi.files.rootDir();//.baseURL(); // file://localhost:8088/files

    //     try {
    //         const filePath = `${baseUrl}${relativePath}/addon_package.json`;
    //         if (await existFile(filePath)) {
    //             // Read file from path and read the data into fileData variable.
    //             const fileData = await readFile(filePath, 'utf8');
    //             const clientZipData: IClientZipFilesData = JSON.parse(fileData);
    
    //             if (clientZipData && clientZipData.Symlinks) {
    //                 for (let index = 0; index < clientZipData.Symlinks.length; index++) {
    //                     const symlinkData: ISymlinkFilesData = clientZipData.Symlinks[index];
    
    //                     if (symlinkData.ExcludedFileName && symlinkData.ExcludedFileName.length > 0) {
    //                         const symlinkName = symlinkData.ExcludedFileName;
    //                         const symlinkTargetPath = `${baseUrl}/Addon/Public/${AddonUUID}/${this.addonVersion}/assets/externals${symlinkData.AdditionalData.RelativePathToFolder}/${symlinkName}`; // symlink.RelativePathToOriginal.replace(AddonVersionString, AddonVersion);
    //                         const symlinkPath = `${baseUrl}${relativePath}/${symlinkName}`;
    
    //                         try {
    //                             await symlink(symlinkTargetPath, symlinkPath);
    //                         } catch (err) {
    //                             console.error(`Symlink creation failed: ${err}`);
    //                             // throw new Error(`Symlink creation failed: ${ err}`);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error(`Error read addon_package.json file: ${error}`);
    //     }
    // }

    // Copy the excluded files back to the client zip folder (from the pepperi_pack addon).
    async copyExcludedFiles(addonUUIDToCopyFiles: string, relativePath: string): Promise<void> {
        const baseUrl = await pepperi.files.rootDir();//.baseURL(); // file://localhost:8088/files
        const filePath = `${baseUrl}${relativePath}/addon_package.json`;

        if (await existFile(filePath)) {
            // Read file from path and read the data into fileData variable.
            const fileData = await readFile(filePath, 'utf8');
            const clientZipData: IClientZipFilesData = JSON.parse(fileData);

            if (clientZipData && clientZipData.Symlinks) {
                let fileDataToCopy;

                for (let index = 0; index < clientZipData.Symlinks.length; index++) {
                    const symlinkData: ISymlinkFilesData = clientZipData.Symlinks[index];

                    if (symlinkData.ExcludedFileName) {
                        const symlinkName = symlinkData.ExcludedFileName;
                        const filePathToCopyFrom = `${baseUrl}/Addon/Public/${AddonUUID}/${this.addonVersion}/assets/externals${symlinkData.AdditionalData.RelativePathToFolder}/${symlinkName}`; // symlink.RelativePathToOriginal.replace(AddonVersionString, AddonVersion);
                        const filePathToCopyTo = `${baseUrl}${relativePath}/${symlinkName}`;
                        
                        fileDataToCopy = await readFile(filePathToCopyFrom, 'utf8');
                        
                        try {
                            var re = new RegExp(`file_${AddonUUID}`, "g");
                            await writeFile(filePathToCopyTo, fileDataToCopy.replace(re, `file_${addonUUIDToCopyFiles}`), 'utf8');
                        } catch (err) {
                            console.error(`Write file ${filePathToCopyTo} failed: ${err}`);
                        }
                    }
                }
            }
        }
    }
}
export default ClientZipService;
