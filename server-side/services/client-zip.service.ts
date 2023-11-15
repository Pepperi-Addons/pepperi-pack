import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { AddonVersionString, IClientZipData } from 'shared';

export class ClientZipService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    async getClientZipData(clientZipExternals: any): Promise<IClientZipData> {
        // This is param (AddonVersionString) will be replace in the CPI endpoint (that create the symlink files).
        const res: IClientZipData = {
            Symlinks: []
        };

        let externalPartial = '';
        let externalVersion = '';
        Object.keys(clientZipExternals).forEach(externalKey => {
            externalVersion = clientZipExternals[externalKey];
            externalPartial = `${externalKey.replace('@', '').replace('/', '_')}`;

            res.Symlinks.push({
                PartialFileNameToExlude: externalPartial
            });
        });

        return res;
    }
}
