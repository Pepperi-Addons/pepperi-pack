import '@pepperi-addons/cpi-node'
import ClientZipService from './client-zip.service';
import { AddonUUID } from "../addon.config.json";
import { IContextWithData } from '@pepperi-addons/cpi-node/build/cpi-side/events';

let addonVersion = '';

export async function load(configuration: any): Promise<void> {
    
    // AddonVersion from ADAL maybe need another option.
    const CPI_NODE_ADDON_UUID = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
    const addonData = await pepperi.addons.data.uuid(CPI_NODE_ADDON_UUID).table('addons').key(AddonUUID).get();

    if (addonData && addonData.Version) {
        addonVersion = addonData.Version;
    }

    pepperi.events.intercept('AfterAddonFilesUnzipped' as any, {}, async (data: IContextWithData): Promise<any> => {
        // debugger;
        const res = { symlinksFilesCreated: false };
        const relativePath = data.RelativePath || '';

        if (relativePath) {
            const service = new ClientZipService(addonVersion);
            await service.createSymlinksFiles(relativePath);
            res.symlinksFilesCreated = true;
        }

        return res;
    });
    
    return Promise.resolve();
}

export const router = Router()
// router.get('/test', (req, res) => {
//     res.json({
//         hello: 'World'
//     })
// })

// router.post('/create_symlinks', async (req, res, next) => {
//     let result = {};

//     try {
//         const relativePath = req.body['relative_path']?.toString();
//         if (relativePath) {
//             const service = new ClientZipService(addonVersion);
//             await service.createSymlinksFiles(relativePath, req.context);
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({err});
//         // next(err);
//     }

//     res.json(result);
// });
