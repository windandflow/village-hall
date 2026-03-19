/**
 * Type stub for @windandflow/sdk
 * Used when the SDK package is not available (e.g., Vercel build).
 * Will be superseded by the actual package types when installed locally.
 */
declare module '@windandflow/sdk' {
  export class WFClient {
    constructor(config: {
      supabaseUrl: string;
      supabaseKey: string;
      contracts?: {
        passportAddress?: string;
        visaAddress?: string;
      };
      chain?: string;
    });
    identity: {
      createEntity(params: Record<string, unknown>): Promise<unknown>;
      getEntity(entityId: string): Promise<unknown>;
      updateProfile(entityId: string, fields: Record<string, unknown>): Promise<unknown>;
    };
    membership: {
      issuePassport(params: Record<string, unknown>): Promise<unknown>;
      getPassport(entityId: string): Promise<unknown>;
      issueVisa(params: Record<string, unknown>): Promise<unknown>;
      getVisa(entityId: string, stateId: string): Promise<unknown>;
      getVisas(entityId: string): Promise<unknown[]>;
      upgradeVisa(params: Record<string, unknown>): Promise<unknown>;
      createInvitation(params: Record<string, unknown>): Promise<unknown>;
      acceptInvitation(params: Record<string, unknown>): Promise<unknown>;
      getState(stateId: string): Promise<unknown>;
      listStates(): Promise<unknown[]>;
      updateCoopStatus(params: Record<string, unknown>): Promise<unknown>;
    };
    relationship: {
      getBond(a: string, b: string, stateId?: string): Promise<unknown>;
      getBonds(params: Record<string, unknown>): Promise<unknown[]>;
    };
    activity: {
      logEvent(params: Record<string, unknown>): Promise<unknown>;
      getEvents(params: Record<string, unknown>): Promise<unknown[]>;
      checkin(params: Record<string, unknown>): Promise<unknown>;
    };
  }
}
