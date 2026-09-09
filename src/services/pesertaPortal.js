import portalData from '@/data/pesertaPortal.json'

export const getDummyParticipant = (participantId) => {
  return portalData.participants.find(item => String(item.id_peserta) === String(participantId)) || null
}

export const getDummyParticipantAccount = (username, password) => {
  const login = String(username || '').trim().toLowerCase()
  return portalData.accounts.find(account => (
    (String(account.username).toLowerCase() === login || String(account.email).toLowerCase() === login)
    && account.password === password
  )) || null
}
