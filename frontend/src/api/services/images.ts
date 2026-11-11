import { HttpMethodEnum, ServiceDefinition } from "../types";

const baseUrl = (path = '') => `http://localhost:5000/api` + path;

export const Images: ServiceDefinition = {

  posts: () => ({
    url: baseUrl('/todos/1'),
    method: HttpMethodEnum.GET
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
