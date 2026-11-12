import { BaseUrlKind } from './services/constant';

class ApiServiceClass {
  private _coreUrl: string;
  private _cloudinaryUrl: string;

  constructor() {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    const apiVersion = process.env.REACT_APP_API_VERSION || '';
    const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
    const cloudinaryFileLocation = process.env.CLOUDINARY_FILE_LOCATION || '';

    this._coreUrl = `${baseUrl}/${apiVersion}`;
    this._cloudinaryUrl = `${cloudinaryUrl}/${cloudinaryFileLocation}`;
  }

  url(type: string, path: string): string {
    if (!BaseUrlKind[type as keyof typeof BaseUrlKind]) {
      throw new Error(
        `Wrong type of URL: ${type}. Use BaseUrlKind for compatible types.`
      );
    }

    const urlBase = (this as Record<string, any>)['_' + type];
    if (!urlBase) {
      throw new Error(
        `Environment variable for URL type '${type}' is not set.`
      );
    }

    // Ensures clean slash formatting between base and path
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${urlBase}${cleanPath}`;
  }

  coreUrl(path: string): string {
    return this.url('coreUrl', path);
  }
  cloudinaryUrl(path: string): string {
    return this.url('cloudinaryUrl', path);
  }
}

export const ApiService = new ApiServiceClass();
export default ApiService;