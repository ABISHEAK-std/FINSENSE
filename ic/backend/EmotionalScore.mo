module {
  public type EmotionalScore = {
    score : Nat;
    control : Nat;
    awareness : Nat;
    decision : Nat;
    mood : Nat; // 0–10
    suggestions : [Text];
  };

  public func empty() : EmotionalScore = {
    score = 0; control = 0; awareness = 0; decision = 0; mood = 0; suggestions = []
  };
}