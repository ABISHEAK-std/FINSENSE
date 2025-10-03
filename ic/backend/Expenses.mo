module {
  public type Expense = {
    id : Nat;
    category : Text;
    amount : Nat; // in smallest currency unit
    ts : Int;
    note : ?Text;
  };
}