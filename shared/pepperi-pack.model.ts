export const AddonVersionString = '{{AddonVersion}}';

// The response to the client zip handler.
export interface IClientZipData {
    Symlinks: ISymlinkData[];
}
export interface ISymlinkData {
    PartialFileNameToExlude: string;
}

// The input file data from the client zip handler.
export interface IClientZipFilesData {
    Symlinks: ISymlinkFilesData[];
}
export interface ISymlinkFilesData {
    ExludedFileName: string;
}