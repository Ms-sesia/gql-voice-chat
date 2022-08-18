export default {
  Query: {
    test: async (_, args, { request, isAuthenticated }) => {
      try {
        console.log("쿼리");
        return true;
      } catch (e) {
        console.log("쿼리 테스트 에러");
      }
    },
  },
};
