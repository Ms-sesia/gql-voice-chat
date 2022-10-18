import fs from "fs";
import path from "path";

export default {
  Mutation: {
    multiFileUpload: async (_, args, __) => {
      const { files } = args;
      const storagePath = path.join(__dirname, "../../../", "./Images");
      console.log("저장 경로: ", storagePath);
      try {
        console.log("파일 정보: ", files);
        let url_ = [];
        for (let i = 0; i < files.length; i++) {
          const { createReadStream, filename, mimetype } = await files[i];
          const stream = createReadStream();

          const fileRename = `${Date.now()}-${filename}`;
          const fileStoragePath = `${storagePath}/${fileRename}`;

          await stream.pipe(fs.createWriteStream(fileStoragePath));

          const multiUrl = `http://localhost:4000/${fileRename}`;

          url_.push(multiUrl);
        }
        return url_;
      } catch (e) {
        console.log("멀티 파일 업로드 에러. multiFileUpload", e);
      }
    },
  },
};
