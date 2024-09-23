import { abi } from "./abi";

const CONTRACT_ADDRESS = "0x61FD2dedA9c8a1ddb9F3F436D548C58643936f02";

enum FunctionNames {
  SET_POOL_METADATA = "setPoolMetadata",
  POOL_METADATA_CID_MAP = "poolIdMetadataCIDMap",
}

export { abi, CONTRACT_ADDRESS, FunctionNames };
