let availability = undefined

export default function localStorageAvailable() {
	if (availability === undefined) {
		const x = 'testValue'
		try {
			localStorage.setItem(x, x)
			localStorage.removeItem(x)
			availability = true
		} catch (e) {
			availability = false
		}
	}
	return availability
}
