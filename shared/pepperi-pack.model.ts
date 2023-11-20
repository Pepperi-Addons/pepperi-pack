export const AddonVersionString = '{{AddonVersion}}';

// The response to the client zip handler.
export interface IClientZipData {
    Symlinks: ISymlinkData[];
}
export interface ISymlinkData {
    PartialFileNameToExclude: string;
    AdditionalData: ISymlinkAdditionalData;
}

// The input file data from the client zip handler.
export interface IClientZipFilesData {
    Symlinks: ISymlinkFilesData[];
}
export interface ISymlinkFilesData {
    ExcludedFileName: string;
    AdditionalData: ISymlinkAdditionalData;
}

export interface ISymlinkAdditionalData {
    RelativePathToFolder: string;
}