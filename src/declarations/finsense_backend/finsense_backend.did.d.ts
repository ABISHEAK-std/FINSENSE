import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Expense {
  'id' : bigint,
  'title' : string,
  'date' : string,
  'category' : string,
  'amount' : bigint,
}
export interface Finsense {
  'addExpense' : ActorMethod<[string, bigint, string, string], Expense>,
  'addHolding' : ActorMethod<[string, bigint, bigint], Holding>,
  'addMessage' : ActorMethod<[string, bigint], Message>,
  'chat' : ActorMethod<
    [{ 'user_id' : string, 'language' : string, 'message' : string }],
    { 'emotion' : string, 'advice' : string }
  >,
  'getExpenses' : ActorMethod<[], Array<Expense>>,
  'getHoldings' : ActorMethod<[], Array<Holding>>,
  'getMessages' : ActorMethod<[], Array<Message>>,
  'removeExpense' : ActorMethod<[bigint], boolean>,
  'removeHolding' : ActorMethod<[bigint], boolean>,
}
export interface Holding {
  'id' : bigint,
  'shares' : bigint,
  'avgPrice' : bigint,
  'symbol' : string,
}
export interface Message {
  'id' : bigint,
  'content' : string,
  'timestamp' : bigint,
}
export interface _SERVICE extends Finsense {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
