import { Group } from "jazz-tools";
import { List, ListManagerAccount, ListOfTodos } from "./schema";

export const createList = (owner: ListManagerAccount) => {
  const group = Group.create({ owner: owner });
  const newList = List.create(
    {
      name: "Einkaufsliste",
      todos: ListOfTodos.create([], { owner: group }),
    },
    { owner: group }
  );
  return newList;
};

// export const acceptListInvite = async (
//   me: Account,
//   invitation: {
//     valueID: ID<CoValue>;
//     valueHint?: string;
//     inviteSecret: InviteSecret;
//   },
//   onSuccess: (list: List) => void,
//   onError?: () => void
// ) => {
//   const sharedList = await me.acceptInvite(
//     invitation.valueID,
//     invitation.inviteSecret,
//     List
//   );

//   console.log(sharedList);

// if (sharedList?.id) {
//   const list = await List.load(sharedList.id, me, [{}]);
//   if (list) onSuccess(list);
//   else onError?.();
// } else onError?.();
// };
