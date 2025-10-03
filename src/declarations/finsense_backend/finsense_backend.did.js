export const idlFactory = ({ IDL }) => {
  const Expense = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'date' : IDL.Text,
    'category' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const Holding = IDL.Record({
    'id' : IDL.Nat,
    'shares' : IDL.Nat,
    'avgPrice' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Message = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'timestamp' : IDL.Nat,
  });
  const Finsense = IDL.Service({
    'addExpense' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text, IDL.Text],
        [Expense],
        [],
      ),
    'addHolding' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [Holding], []),
    'addMessage' : IDL.Func([IDL.Text, IDL.Nat], [Message], []),
    'chat' : IDL.Func(
        [
          IDL.Record({
            'user_id' : IDL.Text,
            'language' : IDL.Text,
            'message' : IDL.Text,
          }),
        ],
        [IDL.Record({ 'emotion' : IDL.Text, 'advice' : IDL.Text })],
        [],
      ),
    'getExpenses' : IDL.Func([], [IDL.Vec(Expense)], ['query']),
    'getHoldings' : IDL.Func([], [IDL.Vec(Holding)], ['query']),
    'getMessages' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'removeExpense' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeHolding' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
  return Finsense;
};
export const init = ({ IDL }) => { return []; };
