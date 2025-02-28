import { MaptilerMapIds } from "../mapFilters";

export type MaptilerCredentials = {
  maptilerApiKey: string | undefined;
  maptilerMapIds: MaptilerMapIds;
};
