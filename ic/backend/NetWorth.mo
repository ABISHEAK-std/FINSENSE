module {
  public type HistoryPoint = { dateText : Text; value : Nat };
  public type NetWorth = {
    current : Nat;
    change : Int;
    changePercent : Float;
    assets : Nat;
    liabilities : Nat;
    history : [HistoryPoint];
  };

  public func empty() : NetWorth = {
    current = 0; change = 0; changePercent = 0.0;
    assets = 0; liabilities = 0; history = []
  };
}