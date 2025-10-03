import React from "react";
import Routes from "./Routes";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  return (
    <AuthWrapper>
      <Routes />
    </AuthWrapper>
  );
}

export default App;

