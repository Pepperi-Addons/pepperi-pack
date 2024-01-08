import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { AddonVersionString, IClientZipData } from 'shared';

export class ClientZipService {

    papiClient: PapiClient
    
    private readonly _supportedExternals = [
        { folder: '@angular/animations/14', installedVersion: '14.0.2' },
        { folder: '@angular/cdk/14', installedVersion: '14.0.2' },
        { folder: '@angular/common/14', installedVersion: '14.0.2' },
        { folder: '@angular/core/14', installedVersion: '14.0.2' },
        { folder: '@angular/elements/14', installedVersion: '14.0.2' },
        { folder: '@angular/flex-layout/14', installedVersion: '14.0.0' },
        { folder: '@angular/forms/14', installedVersion: '14.0.2' },
        { folder: '@angular/material/14', installedVersion: '14.0.2' },
        { folder: '@angular/platform-browser/14', installedVersion: '14.0.2' },
        { folder: '@angular/router/14', installedVersion: '14.0.2' },
        { folder: '@mat-datetimepicker/core/9', installedVersion: '9.0.68' },
        { folder: '@ngx-translate/core/14', installedVersion: '14.0.0' },
        { folder: '@pepperi-addons/ngx-composite-lib/0', installedVersion: '0.4.2' },
        { folder: '@pepperi-addons/ngx-lib/0', installedVersion: '0.4.2' },
        { folder: 'hammerjs/2', installedVersion: '2.0.8' },
        { folder: 'moment/2', installedVersion: '2.27.0' },
        { folder: 'ng-gallery/5', installedVersion: '5.0.0' },
        { folder: 'ng2-file-upload/1', installedVersion: '1.4.0' },
        { folder: 'ngx-quill/12', installedVersion: '12.0.1' },
        { folder: 'ngx-signaturepad/0', installedVersion: '0.0.9' },
        { folder: 'ngx-virtual-scroller/4', installedVersion: '4.0.3' },
        { folder: 'quill/1', installedVersion: '1.3.7' },
        { folder: 'rxjs/7', installedVersion: '7.8.0' },
    ];

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    private doesFolderExist(relativePathToFolder: string): boolean {
        const isFolderSupported = this._supportedExternals.map(se => se.folder).includes(relativePathToFolder.toLowerCase());
        return isFolderSupported;
    }

    async getClientZipData(clientZipExternals: any): Promise<IClientZipData> {
        console.log(`clientZipExternals input - ${JSON.stringify(clientZipExternals)}`);

        const res: IClientZipData = {
            Symlinks: []
        };

        let externalPartial = '';
        let externalVersion = '';
        Object.keys(clientZipExternals).forEach(externalKey => {
            externalVersion = clientZipExternals[externalKey];
            externalPartial = `${externalKey.replace('@', '').replace('/', '_')}`;
            
            console.log(`externalKey - ${externalKey} with version ${externalVersion}`);
            const pathToFolder = `${externalKey}/${externalVersion}`;

            // Check if this folder exist in assets, then push it to the array.
            const externalFolderExist = this.doesFolderExist(pathToFolder);

            if (externalFolderExist) {
                res.Symlinks.push({
                    PartialFileNameToExclude: `node_modules_${externalPartial}_`,
                    AdditionalData: {
                        RelativePathToFolder: `/${pathToFolder}`
                    }
                });
            } else {
                throw new Error(`Dependencies doesn't supported - ${externalKey} with version ${externalVersion}`);
            }
        });

        return res;
    }
}
