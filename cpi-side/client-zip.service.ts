import { IClientZipFilesData, ISymlinkFilesData } from 'shared';
import { AddonUUID } from "../addon.config.json";
import fs from 'fs';
import util from 'util';

const existFile = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const symlink = util.promisify(fs.symlink);
const copyFile = util.promisify(fs.copyFile);

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
    async copyExcludedFiles(inputAddonUUID: string, relativePath: string): Promise<void> {
        const baseUrl = await pepperi.files.rootDir();//.baseURL(); // file://localhost:8088/files
        const filePath = `${baseUrl}${relativePath}/addon_package.json`;

        if (await existFile(filePath)) {
            // Read file from path and read the data into fileData variable.
            const fileData = await readFile(filePath, 'utf8');
            const clientZipData: IClientZipFilesData = JSON.parse(fileData);
            
            if (clientZipData && clientZipData.Symlinks) {
                let fileDataToCopy;
                const pepperiPackAddonUUIDToFind = AddonUUID.replace(/-/g, '_');
                const inputAddonUUIDToSet = inputAddonUUID.replace(/-/g, '_');
                const regex = new RegExp(`file_${pepperiPackAddonUUIDToFind}`, 'g');

                for (let index = 0; index < clientZipData.Symlinks.length; index++) {
                    const symlinkData: ISymlinkFilesData = clientZipData.Symlinks[index];

                    if (symlinkData.ExcludedFileName) {
                        const symlinkName = symlinkData.ExcludedFileName;
                        const filePathToCopyFrom = `${baseUrl}/Addon/Public/${AddonUUID}/${this.addonVersion}/assets/externals${symlinkData.AdditionalData.RelativePathToFolder}/${symlinkName}`; // symlink.RelativePathToOriginal.replace(AddonVersionString, AddonVersion);
                        const filePathToCopyTo = `${baseUrl}${relativePath}/${symlinkName}`;
                        
                        try {
                            fileDataToCopy = await readFile(filePathToCopyFrom, 'utf8');
                            await writeFile(filePathToCopyTo, fileDataToCopy.replace(regex, `file_${inputAddonUUIDToSet}`), 'utf8');
                        } catch (err) {
                            console.error(`Write file ${filePathToCopyTo} failed: ${err}`);
                        }

                        // try {
                        //     await copyFile(filePathToCopyFrom, filePathToCopyTo);
                        //     fileDataToCopy = await readFile(filePathToCopyTo, 'utf8');
                        //     // fileDataToCopy = await readFile(filePathToCopyTo).toString();
                        //     var re = new RegExp(`file_${AddonUUID}`, "g");
                        //     var tmp = fileDataToCopy.split(`file_${AddonUUID.replace(/-/g, '_')}`);// replace(`%file_${AddonUUID}%`, `file_${addonUUIDToCopyFiles}`);
                        //     var tmp2 = tmp.join(`file_${addonUUIDToCopyFiles}`);
                        //     await writeFile(filePathToCopyTo, tmp, 'utf8');
                        // } catch (err) {
                        //     console.error(`Write file ${filePathToCopyTo} failed: ${err}`);
                        // }
                    }
                }
            }
        }
    }
}
export default ClientZipService;
