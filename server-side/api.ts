import { Client, Request } from '@pepperi-addons/debug-server'
import { ClientZipService } from './services/client-zip.service';

export async function addon_package(client: Client, request: Request): Promise<any> {
    try {
        const service = new ClientZipService(client);
        return service.getClientZipData(request?.body['Dependencies']);
    } catch (err) {
        throw new Error(`Failed to get client zip data. error - ${err}`);
    }
}
