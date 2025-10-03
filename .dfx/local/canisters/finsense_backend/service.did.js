export const idlFactory = ({ IDL }) => {
  const Message = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'emotion' : IDL.Opt(IDL.Text),
    'messageType' : IDL.Text,
    'timestamp' : IDL.Int,
  });
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
  const Income = IDL.Record({
    'id' : IDL.Nat,
    'source' : IDL.Text,
    'emotion' : IDL.Text,
    'date' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'amount' : IDL.Nat,
  });
  const ChatInteraction = IDL.Record({
    'id' : IDL.Nat,
    'emotion' : IDL.Text,
    'userMessage' : IDL.Text,
    'entities' : IDL.Vec(IDL.Text),
    'timestamp' : IDL.Int,
    'botResponse' : IDL.Text,
  });
  const UserProfile = IDL.Record({
    'salary' : IDL.Opt(IDL.Nat),
    'country' : IDL.Opt(IDL.Text),
    'riskTolerance' : IDL.Opt(IDL.Text),
    'expenses' : IDL.Opt(IDL.Nat),
    'name' : IDL.Opt(IDL.Text),
    'language' : IDL.Opt(IDL.Text),
    'lifeStage' : IDL.Opt(IDL.Text),
    'goals' : IDL.Vec(IDL.Text),
    'targetSavings' : IDL.Opt(IDL.Nat),
  });
  const Finsense = IDL.Service({
    'addBotMessage' : IDL.Func([IDL.Text, IDL.Text], [Message], []),
    'addExpense' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text, IDL.Text],
        [Expense],
        [],
      ),
    'addHolding' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [Holding], []),
    'addIncome' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Opt(IDL.Text), IDL.Text, IDL.Text],
        [Income],
        [],
      ),
    'addMessage' : IDL.Func([IDL.Text, IDL.Int], [Message], []),
    'deleteUserData' : IDL.Func([], [IDL.Bool], []),
    'exportUserData' : IDL.Func(
        [],
        [
          IDL.Record({
            'messages' : IDL.Vec(Message),
            'chatInteractions' : IDL.Vec(ChatInteraction),
            'expenses' : IDL.Vec(Expense),
            'holdings' : IDL.Vec(Holding),
            'incomes' : IDL.Vec(Income),
            'profile' : IDL.Opt(UserProfile),
          }),
        ],
        ['query'],
      ),
    'getCanisterInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalMessages' : IDL.Nat,
            'totalExpenses' : IDL.Nat,
            'totalHoldings' : IDL.Nat,
            'totalChatInteractions' : IDL.Nat,
            'totalIncomes' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getChatInteractions' : IDL.Func([], [IDL.Vec(ChatInteraction)], ['query']),
    'getExpenses' : IDL.Func([], [IDL.Vec(Expense)], ['query']),
    'getHoldings' : IDL.Func([], [IDL.Vec(Holding)], ['query']),
    'getIncomes' : IDL.Func([], [IDL.Vec(Income)], ['query']),
    'getMessages' : IDL.Func([], [IDL.Vec(Message)], ['query']),
    'getUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'removeExpense' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeHolding' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeIncome' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'storeChatInteraction' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [ChatInteraction],
        [],
      ),
    'updateUserProfile' : IDL.Func(
        [
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Vec(IDL.Text)),
        ],
        [UserProfile],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return Finsense;
};
export const init = ({ IDL }) => { return []; };
