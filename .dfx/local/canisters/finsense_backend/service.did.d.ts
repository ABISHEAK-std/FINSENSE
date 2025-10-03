import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ChatInteraction {
  'id' : bigint,
  'emotion' : string,
  'userMessage' : string,
  'entities' : Array<string>,
  'timestamp' : bigint,
  'botResponse' : string,
}
export interface Expense {
  'id' : bigint,
  'title' : string,
  'date' : string,
  'category' : string,
  'amount' : bigint,
}
export interface Finsense {
  'addBotMessage' : ActorMethod<[string, string], Message>,
  'addExpense' : ActorMethod<[string, bigint, string, string], Expense>,
  'addHolding' : ActorMethod<[string, bigint, bigint], Holding>,
  'addIncome' : ActorMethod<
    [bigint, string, [] | [string], string, string],
    Income
  >,
  'addMessage' : ActorMethod<[string, bigint], Message>,
  'deleteUserData' : ActorMethod<[], boolean>,
  'exportUserData' : ActorMethod<
    [],
    {
      'messages' : Array<Message>,
      'chatInteractions' : Array<ChatInteraction>,
      'expenses' : Array<Expense>,
      'holdings' : Array<Holding>,
      'incomes' : Array<Income>,
      'profile' : [] | [UserProfile],
    }
  >,
  'getCanisterInfo' : ActorMethod<
    [],
    {
      'totalMessages' : bigint,
      'totalExpenses' : bigint,
      'totalHoldings' : bigint,
      'totalChatInteractions' : bigint,
      'totalIncomes' : bigint,
    }
  >,
  'getChatInteractions' : ActorMethod<[], Array<ChatInteraction>>,
  'getExpenses' : ActorMethod<[], Array<Expense>>,
  'getHoldings' : ActorMethod<[], Array<Holding>>,
  'getIncomes' : ActorMethod<[], Array<Income>>,
  'getMessages' : ActorMethod<[], Array<Message>>,
  'getUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'removeExpense' : ActorMethod<[bigint], boolean>,
  'removeHolding' : ActorMethod<[bigint], boolean>,
  'removeIncome' : ActorMethod<[bigint], boolean>,
  'storeChatInteraction' : ActorMethod<
    [string, string, string, Array<string>],
    ChatInteraction
  >,
  'updateUserProfile' : ActorMethod<
    [
      [] | [string],
      [] | [bigint],
      [] | [bigint],
      [] | [string],
      [] | [bigint],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [Array<string>],
    ],
    UserProfile
  >,
  'whoami' : ActorMethod<[], Principal>,
}
export interface Holding {
  'id' : bigint,
  'shares' : bigint,
  'avgPrice' : bigint,
  'symbol' : string,
}
export interface Income {
  'id' : bigint,
  'source' : string,
  'emotion' : string,
  'date' : string,
  'description' : [] | [string],
  'amount' : bigint,
}
export interface Message {
  'id' : bigint,
  'content' : string,
  'emotion' : [] | [string],
  'messageType' : string,
  'timestamp' : bigint,
}
export interface UserProfile {
  'salary' : [] | [bigint],
  'country' : [] | [string],
  'riskTolerance' : [] | [string],
  'expenses' : [] | [bigint],
  'name' : [] | [string],
  'language' : [] | [string],
  'lifeStage' : [] | [string],
  'goals' : Array<string>,
  'targetSavings' : [] | [bigint],
}
export interface _SERVICE extends Finsense {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
