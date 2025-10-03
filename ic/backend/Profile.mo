module {
  public type Profile = {
    language : Text;
    culturalContext : Text; // e.g. "en", "hindi", etc.
    timezone : Text;
    displayName : ?Text;
  };

  public func empty() : Profile = {
    language = "en"; culturalContext = "default"; timezone = "UTC"; displayName = null
  };
}