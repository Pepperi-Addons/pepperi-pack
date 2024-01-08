import { AddonData, Relation, SearchBody } from '@pepperi-addons/papi-sdk';
import { IClientZipFilesData, ISymlinkFilesData } from 'shared';
import config from '../addon.config.json';
import path from 'path';
import fs from 'fs';
import util from 'util';
import AdmZip from 'adm-zip';
import { Promise } from 'bluebird';

// import { extractArchive, Zip } from 'node-7z-archive';
// import { extractArchive } from 'node-7z-forall';
// const Zip = require('node-7z-forall');
// const extractFull = Zip.extractFull;

// ESM for Node JS v12+
// import { extractFull } from 'node-7z-forall';

// // const extractArchive = require('node-7z-archive');

// const SevenZip = require('node-7z-archive');
// var a = new SevenZip();


// import sevenBin from '7zip-bin'
// import { extractFull } from 'node-7z';
// import { createArchive, deleteArchive, extractArchive, fullArchive, listArchive, renameArchive, testArchive, updateArchive } from 'node-7z-archive';
// const _7z = require('7zip-min');
// const zip = require('7zip-min');
// const Zip = require('node-7z-forall');

// import Zip from 'node-7z-forall';
// import createSfxMac from 'node-7z-forall'; 

// import { extract }  from '@steezcram/sevenzip';
// const { extract } = require('@steezcram/sevenzip');
// extract
// import SevenZip from 'node-7z-archive';

// import { extractArchive } from 'node-7z-archive';

// const SevenZip = require('node-7z-archive');

// const _7z = require('7zip-min'); // Note: This is work only need to handle the file to created by the rollup.

const existFile = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);
const existsAsync = util.promisify(fs.exists);
const readdirAsync = util.promisify(fs.readdir);


const CPI_NODE_ADDON_UUID = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
const ADDON_TABLE_NAME = 'addons';
// const ADDON_FILES_TABLE_NAME = 'AddonFiles';

// Deprecated: Should taken from papi-sdk
interface AddonMetaData extends AddonData {
    Key: string; // addonUUID
    Version: string;
    CPISideFiles: string[];
    Relations: any;
    AssetsBaseUrl: string;
    Hidden: boolean;
}

class ClientZipService {

    constructor() {
    }

    /***********************************************************************************************/
    /*                                  Public functions
    /***********************************************************************************************/

    // // Copy the excluded files back to the client zip folder (from the pepperi_pack addon).
    // private async copyExcludedFiles(rootDir: string, inputAddonUUID: string, relativePath: string, pepperiPackVersion: string): Promise<void> {
    //     const filePath = `${rootDir}${relativePath}/addon_package.json`;

    //     if (await existFile(filePath)) {
    //         // Read file from path and read the data into fileData variable.
    //         const fileData = await readFile(filePath, 'utf8');
    //         const clientZipData: IClientZipFilesData = JSON.parse(fileData);
            
    //         if (clientZipData && clientZipData.Symlinks) {
    //             let fileDataToCopy;
    //             const pepperiPackAddonUUIDToFind = config.AddonUUID.replace(/-/g, '_');
    //             const inputAddonUUIDToSet = inputAddonUUID.replace(/-/g, '_');
    //             const regex = new RegExp(`file_${pepperiPackAddonUUIDToFind}`, 'g');

    //             for (let index = 0; index < clientZipData.Symlinks.length; index++) {
    //                 const symlinkData: ISymlinkFilesData = clientZipData.Symlinks[index];

    //                 if (symlinkData.ExcludedFileName) {
    //                     const symlinkName = symlinkData.ExcludedFileName;
    //                     const filePathToCopyFrom = `${rootDir}/Addon/Public/${config.AddonUUID}/${pepperiPackVersion}/assets/externals${symlinkData.AdditionalData.RelativePathToFolder}/${symlinkName}`; // symlink.RelativePathToOriginal.replace(AddonVersionString, AddonVersion);
    //                     const filePathToCopyTo = `${rootDir}${relativePath}/${symlinkName}`;
                        
    //                     try {
    //                         fileDataToCopy = await readFile(filePathToCopyFrom, 'utf8');
    //                         await writeFile(filePathToCopyTo, fileDataToCopy.replace(regex, `file_${inputAddonUUIDToSet}`), 'utf8');
    //                     } catch (err) {
    //                         console.error(`Write file ${filePathToCopyTo} failed: ${err}`);
    //                         throw err;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    private async getAddons(): Promise<AddonMetaData[]> {
        const allAddons = (
            await pepperi.api.adal.getList({
                addon: CPI_NODE_ADDON_UUID,
                table: ADDON_TABLE_NAME,
            })
        ).objects as AddonMetaData[];
        
        return allAddons;
    }

    private async unzipFile(zipFilePath: string): Promise<any> {
        const zip = new AdmZip(zipFilePath);
        const extractAllToAsync = util.promisify(zip.extractAllToAsync.bind(zip)) as any;
        const currentDir = zipFilePath.split('/').slice(0, -1).join('/');

        try {
            await extractAllToAsync(currentDir, true, undefined);
            console.log(`Extracted zip file ${zipFilePath} to ${currentDir}`);
        } catch (error) {
            console.log(`Error while extracting zip file ${zipFilePath}`);
            console.log(error);
        }
    }

    private async prepareAddonFiles(rootDir: string, addon: AddonMetaData, pepperiPackVersion = ''): Promise<void> {
        const addonRelativePath = `${new URL(addon.AssetsBaseUrl).pathname}`;
        const addonDir = path.join(rootDir, addonRelativePath);
        const file = 'client.zip';
        const clientZipPath = path.join(addonDir, file);
        
        // Extract the zip file if needed
        if (await existsAsync(clientZipPath)) {
            const filePath = `${new URL(addon.AssetsBaseUrl).pathname}/${file}`;
            const fileBaseURL = `${new URL(addon.AssetsBaseUrl).origin}`;

            // Make sure that the file was downloaded from fileToDownload map on CPI
            const localPath = await (global as any).app.getLocalFilePath(filePath, fileBaseURL);
            
            try {
                // Unzip file
                await this.unzipFile(localPath);
                console.log(`Unzipped file: ${localPath}`);

                // // Copy excluded files from pepperi-pack assets folder
                // if (pepperiPackVersion) {
                //     await this.copyExcludedFiles(rootDir, addon.Key, addonRelativePath, pepperiPackVersion)
                // }

                // Delete zip file
                await unlinkAsync(localPath);
                console.log(`Deleted file: ${localPath}`);
            } catch (err) {
                console.error(`Error in handle client.zip file for: ${localPath}, err: ${err}`);
            }
        }
    }

    private async prepareClientZipAddons(): Promise<void> {
        const rootDir = await pepperi.files.rootDir();
        let addons: AddonMetaData[] = await this.getAddons();
        const addonsLength = addons?.length || 0;

        // Get the pepperi-pack from all addons.
        const pepperiPackAddon = addons.find(a => a.Key === config.AddonUUID);
        // remove pepperi-pack from addons list.
        addons = addons.filter(addon => addon.Key !== config.AddonUUID);

        // // First open pepperi-pack addon client zip!!!
        // if (pepperiPackAddon) {
        //     await this.prepareAddonFiles(rootDir, pepperiPackAddon);
        // } else {
        //     console.log('Pepperi pack is not installed');
        // }
        
        // If pepperi pack is exist take the version, Else put string empty
        const pepperiPackVersion = pepperiPackAddon?.Version || '';

        // use bluebird to run async functions in concurrency
        // we call it in concurrency because preparing the addon have a lot of disk operations (read/extract/delete)
        await Promise.map(addons, (addon: AddonMetaData) => {
            // NOTE: Inside prepareAddonFiles the copy will skip when pepperiPackVersion is empty (pepperi-pack is not installed), 
            // The unzip and delete will be always.
            this.prepareAddonFiles(rootDir, addon, pepperiPackVersion);
        }, {
            concurrency: 5,
        });

        console.log(`Finished preparing ${addonsLength} addons`);
    
    }

    async prepareAddonsFiles() {
        // Prepare addons client.zip files - devices only
        if (!(await pepperi.environment.isWebApp())) {
            await this.prepareClientZipAddons();
        }
    }

    // async extract7zFiles() {
    //     const rootDir = await pepperi.files.rootDir();
    //     const addonData = await pepperi.addons.data.uuid(CPI_NODE_ADDON_UUID).table(ADDON_TABLE_NAME).key(config.AddonUUID).get();
        
    //     // // AddonVersion from ADAL maybe need another option.
    //     // // const CPI_NODE_ADDON_UUID = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
    //     // // const addonData = await pepperi.addons.data.uuid(CPI_NODE_ADDON_UUID).table('addons').key(AddonUUID).get();

    //     // if (addonData && addonData.Version) {
    //     //     addonVersion = addonData.Version;
    //     // }
        
    //     let addons: AddonMetaData[] = await this.getAddons();
        
    //     // Get the pepperi-pack from all addons.
    //     const pepperiPackAddon = addons.find(a => a.Key === config.AddonUUID);
    //     if (pepperiPackAddon) {
    //         const addonRelativePath = `${new URL(pepperiPackAddon.AssetsBaseUrl).pathname}`;
    //         const addonDir = path.join(rootDir, addonRelativePath);
    //         const file = 'Archive.7z';
    //         const clientZipPath = path.join(addonDir, file);
            
    //         // Extract the zip file if needed
    //         if (await existsAsync(clientZipPath)) {
    //             const filePath = `${addonRelativePath}/${file}`;
    //             const fileBaseURL = `${new URL(pepperiPackAddon.AssetsBaseUrl).origin}`;

    //             // Make sure that the file was downloaded from fileToDownload map on CPI
    //             const localPath = await (global as any).app.getLocalFilePath(filePath, fileBaseURL);
                
    //             try {
    //                 debugger;
    //                 // const currentDir = '/Users/tomer.p/Documents/Pepperi/30014228/Files/Addons/Addon/Public/4817f4fe-9ff6-435e-9415-96b1142675eb/1.1.3';
    //                 // const filePath1 = `${currentDir}/${file}`;
    //                 // // By set the destination as a directory, the archive name will be: test.7z
    //                 // const error = await extract('7z', {archive: filePath1, destination: currentDir}, null, (progress) => {
    //                 //     console.log(progress);
    //                 // });


    //                 // extractArchive(localPath, '.tmp/test')
    //                 // .catch(function (err) {
    //                 //     debugger;
    //                 //     // expect(err).to.be.an.instanceof(Error);
    //                 //     // done();
    //                 // });

    //                 // var unzipTask = new Zip();
    //                 // Extract file
    //                 // Zip.extractArchive(localPath);
    //                 // Zip.extract(localPath).then((res) => {
    //                 //     debugger;
    //                 // });

    //                 // extractArchive(localPath, addonRelativePath).then(()=> {
    //                 //     debugger;
    //                 // });

    //                 debugger;
    //                 // unpack
    //                 _7z.unpack('path/to/archive.7z', 'where/to/unpack', err => {
    //                     // done
    //                 });

    //                 // unpack
    //                 // _7z.unpack(localPath, err => {
    //                 //     // done
    //                 //     debugger;
    //                 // });

    //                 console.log(`Extract 7z file: ${localPath}`);
    //             } catch (err) {
    //                 console.error(`Error in Extract 7z file: ${err}`);
    //             }
    //         }
    //     }
    // }
}
export default ClientZipService;
