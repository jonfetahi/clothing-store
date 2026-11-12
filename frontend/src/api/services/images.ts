import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/image' + path);

export const Images: ServiceDefinition = {
  upload: ({ payload }) => ({
    url: baseUrl('/upload'),
    method: HttpMethodEnum.POST,
    payload
  }),
}

// const url = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
//
// async function uploadImage(file) {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', 'YOUR_UNSIGNED_UPLOAD_PRESET');
//
//   const response = await fetch(url, { method: 'POST', body: formData });
//   return response.json();
