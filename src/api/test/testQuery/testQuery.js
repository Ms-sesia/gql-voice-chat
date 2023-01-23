export default {
  Query: {
    testQuery: async (_, args, { request }) => {
      const { term } = args;
      try {
        if (term) {
          console.log("문구 정상으로 나옴");
          return true;
        } else {
          console.log("정상작동 안함");
          return false;
        }
      } catch (e) {
        console.log("testQuery error: ", e);
      }
    },
  },
};
