export const MIME_TYPES = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV: 'text/csv',
};

export const ACCEPTED_IMAGE_CONFIG = [
  { mimeType: MIME_TYPES.JPEG },
  { mimeType: MIME_TYPES.PNG },
  { mimeType: MIME_TYPES.WEBP },
];

export const ACCEPTED_DOCUMENT_CONFIG = [
  { mimeType: MIME_TYPES.PDF },
  { mimeType: MIME_TYPES.DOCX },
];