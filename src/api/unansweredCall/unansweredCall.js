export default {
  Mutation: {
    unansweredCall: async (_, args, { request }) => {
      const { receiver_id } = args;
      try {
        console.log("부재중 기록을 남깁니다.");
        return {
          result: true,
          error: "",
        };
      } catch (e) {
        console.log("부재중 히스토리 저장 실패. unansweredCall", e);
      }
    },
  },
};
