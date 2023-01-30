import { withFilter } from "graphql-subscriptions";
import pubsub from "../../../libs/pubsub";

export default {
  Subscription: {
    sendCallNoti: {
      /**withFilter 함수는 두 개의 매개변수를 받는다.
       * 첫번째 매개변수는 subscribe에 사용하는 함수이다.
       * 두번째 매개변수는 특정 클라이언트에 보내져야하면 true를 반환하는 filter 함수이다. 이 함수는 두 개의 매개변수를 받는다.
       * payload: 이벤트가 publish 될 때의 payload이다.
       * variables: 클라이언트가 subscription을 시작할 때 제공한 매개변수들을 가지고 있는 객체 */
      subscribe: withFilter(
        () => pubsub.asyncIterator(["sendCall"]),
        (payload, variables) => {
          console.log("payload:", payload);
          console.log("variables:", variables);
          // return true;
          return payload.sendCallNoti.receiverId === variables.user_id;
        }
      ),
    },
  },
};
