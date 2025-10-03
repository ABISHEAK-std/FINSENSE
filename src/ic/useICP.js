import { useEffect, useState } from "react";
import { isAuthenticated, login, logout } from "./auth";
import { getBackendActor } from "./actor";

export function useICP() {
  const [ready, setReady] = useState(false);
  const [actor, setActor] = useState(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      setAuthed(await isAuthenticated());
      setActor(await getBackendActor());
      setReady(true);
    })();
  }, []);

  return {
    ready,
    actor,
    authed,
    login,
    logout
  };
}

// 👉 alias hook for convenience
export function useActor() {
  const { ready, actor } = useICP();
  return { ready, actor };
}