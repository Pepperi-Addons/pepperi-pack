import '@pepperi-addons/cpi-node'
import ClientZipService from './client-zip.service';
import { AddonUUID } from "../addon.config.json";

export async function load(configuration: any): Promise<void> {
    // debugger;
    // const service = new ClientZipService();
    // service.extract7zFiles();

    pepperi.events.intercept('SyncTerminated' as any, {}, async (data: any): Promise<any> => {
        // const res: any = { exludedFilesRetured: false, error: undefined };
// debugger;
        try {
            const service = new ClientZipService();
            // prepareAddonsFiles() is called asynchronously without waiting for it because it takes a long time
            service.prepareAddonsFiles();
            // service.extract7zFiles();

        } catch (err) {
            // res.error = err;
        }

        // return res;
    });

    // pepperi.events.intercept('AfterAddonFilesUnzipped' as any, {}, async (data: IContextWithData): Promise<any> => {
    //     debugger;
    //     const res: any = { exludedFilesRetured: false, error: undefined };

    //     try {
    //         const relativePath = data.RelativePath || '';
    //         const addonUUID = data.AddonUUID || '';
    //         if (addonUUID && relativePath) {
    //             const service = new ClientZipService(addonVersion);
    //             await service.copyExcludedFiles(addonUUID, relativePath);
    //             res.exludedFilesRetured = true;
    //         }
    //     } catch (err) {
    //         res.error = err;
    //     }

    //     return res;
    // });

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
