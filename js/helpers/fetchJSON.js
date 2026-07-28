export default async function fetchJSON(url, options) {
	const response = await fetch(url, options)
	if (!response.ok) throw new Error(`${new URL(url).host} answered ${response.status}`)
	return response.json()
}
