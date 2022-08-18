export default {
  Mutation: {
    mutationTest: async (_, args, { request, isAuthenticated }) => {
      const { year, month } = args;
      try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        console.log(new Date(year, month));
        console.log("검색 시작일:", startDate);
        console.log("검색 종료일:", endDate);
        // await prisma.productMainOrder.findMany({
        //   where: { orderDate: { contain } },
        // });
        return true;
      } catch (e) {
        console.log("뮤테이션 테스트 에러");
      }
    },
  },
};
