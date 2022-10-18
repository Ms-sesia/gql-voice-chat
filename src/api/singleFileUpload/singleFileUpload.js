import fs from "fs";
import path from "path";

export default {
  Mutation: {
    singleFileUpload: async (_, args, __) => {
      const { file } = args;
      const storagePath = path.join(__dirname, "../../../", "./Images");
      try {
        console.log("파일 정보: ", file);
        const { createReadStream, filename, encoding, mimetype } = await file;
        const stream = createReadStream();

        const fileRename = `${Date.now()}-${filename}`;
        const fileStoragePath = `${storagePath}/${fileRename}`;
        console.log("file storage path:", fileStoragePath);

        await stream.pipe(fs.createWriteStream(`${storagePath}/${fileRename}`));

        const singleUrl = `http://localhost:4000/${fileRename}`;

        return singleUrl;
      } catch (e) {
        console.log("싱글 파일 업로드 에러. singleFileUpload", e);
      }
    },
  },
};
