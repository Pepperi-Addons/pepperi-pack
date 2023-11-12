import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class ClientZipService {

    papiClient: PapiClient
    // bundleFileName = '';

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        // this.bundleFileName = `file_${this.client.AddonUUID}`;
    }

    async getClientZipData(clientZipExternals: any): Promise<any> {
        const currentVersion = '1.0.0'; // TODO: Get from package.json
        const relativePathToClientAssetsFolderFromAnyAddonFolder = `../../${this.client.AddonUUID}/${currentVersion}/assets/externals`;
        const res: any = {
            Symlinks: []
        };

        let externalPrefix = '';
        let version = '';
        Object.keys(clientZipExternals).forEach(key => {
            version = clientZipExternals[key];
            externalPrefix = `node_modules_${key.replace('@', '').replace('/', '_')}`;

            res.Symlinks.push({
                ExternalPrefix: externalPrefix,
                RelativePathToOriginal: `${relativePathToClientAssetsFolderFromAnyAddonFolder}/${key}/${version}/`
            });
        });

        return res;
    }
}
