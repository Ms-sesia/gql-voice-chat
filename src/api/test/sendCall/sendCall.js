import pubsub from "../../../libs/pubsub";

export default {
  Mutation: {
    sendCall: async (_, args, { request }) => {
      const { url } = args;

      return {
        result: true,
      };
    },
  },
};
