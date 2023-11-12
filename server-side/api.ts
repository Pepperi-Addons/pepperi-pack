import { Client, Request } from '@pepperi-addons/debug-server'
import { ClientZipService } from './services/client-zip.service';

export async function client_zip(client: Client, request: Request): Promise<any> {
    try {
        const service = new ClientZipService(client);
        return service.getClientZipData(request?.query['externals']);
    } catch(err) {
        throw new Error(`Failed to get client zip data. error - ${err}`);
    }
}