import { Client, Request } from '@pepperi-addons/debug-server'
import { IClientZipData } from 'shared';
import { ClientZipService } from './services/client-zip.service';

export async function client_packages(client: Client, request: Request): Promise<IClientZipData> {
    try {
        const service = new ClientZipService(client);
        console.log(`client_packages body - ${JSON.stringify(request?.body)}`);
        return service.getClientZipData(request?.body['Dependencies']);
    } catch (err) {
        throw new Error(`Failed to get client zip data. error - ${err}`);
    }
}
