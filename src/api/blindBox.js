import request from "@/unit/request"

export const BlindBoxGetAllServer = () => request.get(`/blindBox/today`)

export const BlindBoxBuyServer = (boxId, deliverAddress) => request.post('/blindBox/buy', { deliverAddress }, { params: { boxId } })

export const BlindBoxRevealServer = (boxId) => request.put(`/blindBox/reveal/${boxId}`)