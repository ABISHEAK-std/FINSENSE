export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    // Example NetWorth functions
    getNetWorth: IDL.Func([], [IDL.Nat], ["query"]),
    updateNetWorth: IDL.Func([IDL.Nat], [], []),

    // Example Emotional Score functions
    getEmotionalScore: IDL.Func([], [IDL.Int], ["query"]),
    updateEmotionalScore: IDL.Func([IDL.Int], [], []),

    // Example Expenses functions
    addExpense: IDL.Func([IDL.Text, IDL.Nat], [], []),
    listExpenses: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ["query"]),

    // Example Investments
    addInvestment: IDL.Func([IDL.Text, IDL.Nat], [], []),
    listInvestments: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ["query"]),

    // Example Profile
    getProfile: IDL.Func([], [IDL.Record({ name: IDL.Text, culture: IDL.Text })], ["query"]),
    updateProfile: IDL.Func([IDL.Record({ name: IDL.Text, culture: IDL.Text })], [], []),

    // Example Therapy Chat
    askTherapyBot: IDL.Func([IDL.Text], [IDL.Text], []),
  });
};

export const init = ({ IDL }) => {
  return [];
};