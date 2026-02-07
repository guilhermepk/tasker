import { SyncSituationEnum } from "../models/enums/sync-situation.enum";

export default function compareHashes(
  localFileHash: string,
  cloudFileHash: string,
  lastSynchronizedHash: string
): SyncSituationEnum {
  console.log('localFileHash', localFileHash)
  console.log('cloudFileHash', cloudFileHash)
  console.log('lastSynchronizedHash', lastSynchronizedHash)

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