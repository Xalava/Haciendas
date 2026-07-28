// Display helpers for wallet values.

export const formatBalance = value => {
	const n = Number(value)
	if (!isFinite(n) || n === 0) return '0'
	const abs = Math.abs(n)
	if (abs >= 1000000) return Math.round(n / 100000) / 10 + 'M'
	if (abs >= 1000) return Math.round(n / 100) / 10 + 'k'
	if (abs >= 100) return String(Math.round(n))
	if (abs >= 1) return String(Math.round(n * 10) / 10)
	if (abs >= 0.001) return String(Math.round(n * 1000) / 1000)
	return '<0.001'
}

export const shortAddress = address => {
	if (!address) return ''
	return address.slice(0, 6) + '…' + address.slice(-4)
}

// A default amount to prefill in the send dialog, about a tenth of the balance
export const suggestedAmount = (balance, decimals = 18) => {
	const n = Number(balance)
	if (!isFinite(n) || n <= 0) return 0
	const tenth = n / 10
	if (decimals === 0) return Math.max(1, Math.floor(tenth))
	if (tenth >= 1) return Math.floor(tenth)
	return Math.round(tenth * 10000) / 10000
}
