export type UploadedFile = {
  fieldname: string;
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size:number;
};