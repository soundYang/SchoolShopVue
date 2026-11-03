import request from "@/unit/request"

export const BlindBoxGetAllServer = () => request.get(`/blindBox/today`, { noAuthRedirect: true })

export const BlindBoxBuyServer = (boxId, deliverAddress) => request.post('/blindBox/buy', { deliverAddress }, { params: { boxId } })

export const BlindBoxCreateOrderServer = (boxId, deliverAddress) => request.post('/blindBox/create-order', { boxId, deliverAddress })

export const BlindBoxRevealServer = (boxId) => request.put(`/blindBox/reveal/${boxId}`)