export default {
  Query: {
    getReceiverInfo: async (_, args, __) => {
      const { qr_serial } = args;
      console.log("Query : getRecevierInfo");
      console.log("serial Number:", qr_serial);
      console.log("userId:", 4, "qr_id:", 147);
      return {
        result: true,
        user_id: 4,
        qr_id: 147,
      };
    },
  },
};
