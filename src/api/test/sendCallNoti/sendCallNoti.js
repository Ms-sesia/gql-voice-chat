import pubsub from "../../../libs/pubsub";

export default {
  Subscription: {
    sendCallNoti: {
      subscribe: () => pubsub.asyncIterator(["sendCall"]),
    },
  },
};
