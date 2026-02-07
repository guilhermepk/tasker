import { SyncSituationEnum } from "../models/enums/sync-situation.enum";

export default function compareHashes(
  localFileHash: string,
  cloudFileHash: string,
  lastSynchronizedHash: string
): SyncSituationEnum {

  // Cenário A: Nada mudou (Ocioso)
  if (
    localFileHash === lastSynchronizedHash
    &&
    cloudFileHash === lastSynchronizedHash
  ) return SyncSituationEnum.NOTHING_CHANGED;

  // Cenário B: Trabalho Local (Upload)
  else if (
    localFileHash !== lastSynchronizedHash
    &&
    cloudFileHash === lastSynchronizedHash
  ) return SyncSituationEnum.LOCAL_WORK;

  // Cenário C: Trabalho Remoto (Download)
  else if (
    localFileHash === lastSynchronizedHash
    &&
    cloudFileHash !== lastSynchronizedHash
  ) return SyncSituationEnum.REMOTE_WORK;

  // Cenário D: O Conflito Real (Perguntar ao usuário)
  // localFileHash !== lastSynchronizedHash
  // &&
  // cloudFileHash !== lastSynchronizedHash
  else return SyncSituationEnum.CONFLICT;
}