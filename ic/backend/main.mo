import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";

actor class Finsense() = this {

  // -------------------- TYPES --------------------
  public type Expense = {
    id : Nat;
    title : Text;
    amount : Nat;
    date : Text;
    category : Text;
  };

  public type Holding = {
    id : Nat;
    symbol : Text;
    shares : Nat;
    avgPrice : Nat;
  };

  public type Message = {
    id : Nat;
    content : Text;
    timestamp : Int;
    messageType : Text; // "user" or "bot"
    emotion : ?Text;
  };

  public type ChatInteraction = {
    id : Nat;
    userMessage : Text;
    botResponse : Text;
    emotion : Text;
    timestamp : Int;
    entities : [Text];
  };

  public type Income = {
    id : Nat;
    amount : Nat;
    source : Text;
    description : ?Text;
    date : Text;
    emotion : Text;
  };

  public type UserProfile = {
    name : ?Text;
    salary : ?Nat;
    expenses : ?Nat;
    riskTolerance : ?Text;
    targetSavings : ?Nat;
    country : ?Text;
    language : ?Text;
    lifeStage : ?Text;
    goals : [Text];
  };

  // -------------------- STATE --------------------
  stable var nextExpenseId : Nat = 0;
  stable var nextIncomeId : Nat = 0;
  stable var nextHoldingId : Nat = 0;
  stable var nextMessageId : Nat = 0;
  stable var nextChatId : Nat = 0;

  let expenses = HashMap.HashMap<Principal, [Expense]>(10, Principal.equal, Principal.hash);
  let incomes = HashMap.HashMap<Principal, [Income]>(10, Principal.equal, Principal.hash);
  let holdings = HashMap.HashMap<Principal, [Holding]>(10, Principal.equal, Principal.hash);
  let therapy = HashMap.HashMap<Principal, [Message]>(10, Principal.equal, Principal.hash);
  let chatInteractions = HashMap.HashMap<Principal, [ChatInteraction]>(10, Principal.equal, Principal.hash);
  let userProfiles = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);

  // -------------------- EXPENSES --------------------
  public func addExpense(title : Text, amount : Nat, date : Text, category : Text) : async Expense {
    let caller = Principal.fromActor(this);
    let e : Expense = {
      id = nextExpenseId;
      title = title;
      amount = amount;
      date = date;
      category = category;
    };
    nextExpenseId += 1;

    let curr = switch (expenses.get(caller)) {
      case (?xs) Buffer.fromArray<Expense>(xs);
      case null Buffer.Buffer<Expense>(0);
    };
    curr.add(e);
    expenses.put(caller, Buffer.toArray(curr));
    return e;
  };

  public query func getExpenses() : async [Expense] {
    let caller = Principal.fromActor(this);
    switch (expenses.get(caller)) {
      case (?xs) xs;
      case null [];
    }
  };

  public func removeExpense(id : Nat) : async Bool {
    let caller = Principal.fromActor(this);
    switch (expenses.get(caller)) {
      case (?xs) {
        let curr = Buffer.fromArray<Expense>(xs);
        let filtered = Buffer.Buffer<Expense>(0);
        var removed = false;
        for (e in curr.vals()) {
          if (e.id == id) {
            removed := true;
          } else {
            filtered.add(e);
          };
        };
        expenses.put(caller, Buffer.toArray(filtered));
        return removed;
      };
      case null false;
    }
  };

  // -------------------- INCOME --------------------
  public func addIncome(amount : Nat, source : Text, description : ?Text, date : Text, emotion : Text) : async Income {
    let caller = Principal.fromActor(this);
    let i : Income = {
      id = nextIncomeId;
      amount = amount;
      source = source;
      description = description;
      date = date;
      emotion = emotion;
    };
    nextIncomeId += 1;

    let curr = switch (incomes.get(caller)) {
      case (?xs) Buffer.fromArray<Income>(xs);
      case null Buffer.Buffer<Income>(0);
    };
    curr.add(i);
    incomes.put(caller, Buffer.toArray(curr));
    return i;
  };

  public query func getIncomes() : async [Income] {
    let caller = Principal.fromActor(this);
    switch (incomes.get(caller)) {
      case (?xs) xs;
      case null [];
    }
  };

  public func removeIncome(id : Nat) : async Bool {
    let caller = Principal.fromActor(this);
    switch (incomes.get(caller)) {
      case (?xs) {
        let curr = Buffer.fromArray<Income>(xs);
        let filtered = Buffer.Buffer<Income>(0);
        var removed = false;
        for (i in curr.vals()) {
          if (i.id == id) {
            removed := true;
          } else {
            filtered.add(i);
          };
        };
        incomes.put(caller, Buffer.toArray(filtered));
        return removed;
      };
      case null false;
    }
  };

  // -------------------- HOLDINGS --------------------
  public func addHolding(symbol : Text, shares : Nat, avgPrice : Nat) : async Holding {
    let caller = Principal.fromActor(this);
    let h : Holding = {
      id = nextHoldingId;
      symbol = symbol;
      shares = shares;
      avgPrice = avgPrice;
    };
    nextHoldingId += 1;

    let curr = switch (holdings.get(caller)) {
      case (?xs) Buffer.fromArray<Holding>(xs);
      case null Buffer.Buffer<Holding>(0);
    };
    curr.add(h);
    holdings.put(caller, Buffer.toArray(curr));
    return h;
  };

  public query func getHoldings() : async [Holding] {
    let caller = Principal.fromActor(this);
    switch (holdings.get(caller)) {
      case (?xs) xs;
      case null [];
    }
  };

  public func removeHolding(id : Nat) : async Bool {
    let caller = Principal.fromActor(this);
    switch (holdings.get(caller)) {
      case (?xs) {
        let curr = Buffer.fromArray<Holding>(xs);
        let filtered = Buffer.Buffer<Holding>(0);
        var removed = false;
        for (h in curr.vals()) {
          if (h.id == id) {
            removed := true;
          } else {
            filtered.add(h);
          };
        };
        holdings.put(caller, Buffer.toArray(filtered));
        return removed;
      };
      case null false;
    }
  };

  // -------------------- THERAPY CHAT --------------------
  public func addMessage(content : Text, timestamp : Int) : async Message {
    let caller = Principal.fromActor(this);
    let m : Message = {
      id = nextMessageId;
      content = content;
      timestamp = timestamp;
      messageType = "user";
      emotion = null;
    };
    nextMessageId += 1;

    let curr = switch (therapy.get(caller)) {
      case (?xs) Buffer.fromArray<Message>(xs);
      case null Buffer.Buffer<Message>(0);
    };
    curr.add(m);
    therapy.put(caller, Buffer.toArray(curr));
    return m;
  };

  public func addBotMessage(content : Text, emotion : Text) : async Message {
    let caller = Principal.fromActor(this);
    let m : Message = {
      id = nextMessageId;
      content = content;
      timestamp = Time.now();
      messageType = "bot";
      emotion = ?emotion;
    };
    nextMessageId += 1;

    let curr = switch (therapy.get(caller)) {
      case (?xs) Buffer.fromArray<Message>(xs);
      case null Buffer.Buffer<Message>(0);
    };
    curr.add(m);
    therapy.put(caller, Buffer.toArray(curr));
    return m;
  };

  public query func getMessages() : async [Message] {
    let caller = Principal.fromActor(this);
    switch (therapy.get(caller)) {
      case (?xs) xs;
      case null [];
    }
  };

  // -------------------- CHAT INTERACTIONS --------------------
  public func storeChatInteraction(
    userMessage : Text, 
    botResponse : Text, 
    emotion : Text, 
    entities : [Text]
  ) : async ChatInteraction {
    let caller = Principal.fromActor(this);
    let interaction : ChatInteraction = {
      id = nextChatId;
      userMessage = userMessage;
      botResponse = botResponse;
      emotion = emotion;
      timestamp = Time.now();
      entities = entities;
    };
    nextChatId += 1;

    let curr = switch (chatInteractions.get(caller)) {
      case (?xs) Buffer.fromArray<ChatInteraction>(xs);
      case null Buffer.Buffer<ChatInteraction>(0);
    };
    curr.add(interaction);
    chatInteractions.put(caller, Buffer.toArray(curr));
    return interaction;
  };

  public query func getChatInteractions() : async [ChatInteraction] {
    let caller = Principal.fromActor(this);
    switch (chatInteractions.get(caller)) {
      case (?xs) xs;
      case null [];
    }
  };

  // -------------------- USER PROFILE --------------------
  public func updateUserProfile(
    name : ?Text,
    salary : ?Nat,
    expenses : ?Nat,
    riskTolerance : ?Text,
    targetSavings : ?Nat,
    country : ?Text,
    language : ?Text,
    lifeStage : ?Text,
    goals : ?[Text]
  ) : async UserProfile {
    let caller = Principal.fromActor(this);
    
    let currentProfile = switch (userProfiles.get(caller)) {
      case (?profile) profile;
      case null {
        {
        name = null;
        salary = null;
        expenses = null;
        riskTolerance = null;
        targetSavings = null;
        country = null;
        language = null;
        lifeStage = null;
        goals = [];
        };
      };
    };

    let updatedProfile : UserProfile = {
      name = switch (name) { case (?n) ?n; case null currentProfile.name; };
      salary = switch (salary) { case (?s) ?s; case null currentProfile.salary; };
      expenses = switch (expenses) { case (?e) ?e; case null currentProfile.expenses; };
      riskTolerance = switch (riskTolerance) { case (?r) ?r; case null currentProfile.riskTolerance; };
      targetSavings = switch (targetSavings) { case (?t) ?t; case null currentProfile.targetSavings; };
      country = switch (country) { case (?c) ?c; case null currentProfile.country; };
      language = switch (language) { case (?l) ?l; case null currentProfile.language; };
      lifeStage = switch (lifeStage) { case (?ls) ?ls; case null currentProfile.lifeStage; };
      goals = switch (goals) { case (?g) g; case null currentProfile.goals; };
    };

    userProfiles.put(caller, updatedProfile);
    return updatedProfile;
  };

  public query func getUserProfile() : async ?UserProfile {
    let caller = Principal.fromActor(this);
    userProfiles.get(caller);
  };

  // -------------------- DATA MANAGEMENT --------------------
  public func deleteUserData() : async Bool {
    let caller = Principal.fromActor(this);
    expenses.delete(caller);
    incomes.delete(caller);
    holdings.delete(caller);
    therapy.delete(caller);
    chatInteractions.delete(caller);
    userProfiles.delete(caller);
    return true;
  };

  public query func exportUserData() : async {
    expenses: [Expense];
    incomes: [Income];
    holdings: [Holding];
    messages: [Message];
    chatInteractions: [ChatInteraction];
    profile: ?UserProfile;
  } {
    let caller = Principal.fromActor(this);
    {
      expenses = switch (expenses.get(caller)) { case (?xs) xs; case null []; };
      incomes = switch (incomes.get(caller)) { case (?xs) xs; case null []; };
      holdings = switch (holdings.get(caller)) { case (?xs) xs; case null []; };
      messages = switch (therapy.get(caller)) { case (?xs) xs; case null []; };
      chatInteractions = switch (chatInteractions.get(caller)) { case (?xs) xs; case null []; };
      profile = userProfiles.get(caller);
    };
  };

  // -------------------- SYSTEM INFO --------------------
  public query func whoami() : async Principal {
    Principal.fromActor(this);
  };

  public query func getCanisterInfo() : async {
    totalExpenses: Nat;
    totalIncomes: Nat;
    totalHoldings: Nat;
    totalMessages: Nat;
    totalChatInteractions: Nat;
  } {
    {
      totalExpenses = nextExpenseId;
      totalIncomes = nextIncomeId;
      totalHoldings = nextHoldingId;
      totalMessages = nextMessageId;
      totalChatInteractions = nextChatId;
    };
  };
};