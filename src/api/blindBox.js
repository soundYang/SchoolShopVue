import request from "@/unit/request"

export const BlindBoxGetAllServer = () => request.get(`/blindBox/today`)

export const BlindBoxBuyServer = (boxId, deliverAddress) => request.post(`/blindBox/buy?boxId=${boxId}`, { deliverAddress })

export const BlindBoxRevealServer = (boxId) => request.put(`/blindBox/reveal/${boxId}`)