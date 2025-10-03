import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public func callerId(caller : { caller : Principal }) : UserId {
    caller.caller
  }
}