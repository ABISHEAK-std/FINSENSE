import { HttpAgent, Actor } from "@dfinity/agent";
// generated files will be placed under declarations/finsense_backend after deploy
import { idlFactory as finsense_idl } from "../../declarations/finsense_backend/finsense_backend.did.js";
import canisterIds from "../canister_ids.json";
import { getIdentity } from "./auth";
import { mockBackendService } from "../services/MockBackendService.js";

function currentCanisterId() {
  const network = import.meta.env.VITE_DFX_NETWORK || "local";
  return (canisterIds?.[network] || canisterIds)?.finsense_backend?.canister_id
    || canisterIds?.finsense_backend;
}

export async function getBackendActor() {
  try {
    const identity = await getIdentity();
    const agent = new HttpAgent({ identity, host: import.meta.env.VITE_IC_HOST || "http://127.0.0.1:4943" });

    // for local replica only
    if ((import.meta.env.VITE_DFX_NETWORK || "local") === "local") {
      await agent.fetchRootKey().catch(() => console.warn("fetchRootKey failed (local only)"));
    }

    const canisterId = currentCanisterId();
    
    if (!canisterId || canisterId === "undefined") {
      console.warn("No canister ID available, using mock backend service");
      return mockBackendService;
    }

    return Actor.createActor(finsense_idl, { agent, canisterId });
  } catch (error) {
    console.warn("Failed to create ICP actor, using mock backend service:", error);
    return mockBackendService;
  }
}