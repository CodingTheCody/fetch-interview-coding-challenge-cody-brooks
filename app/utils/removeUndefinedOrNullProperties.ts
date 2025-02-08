export function removeUndefinedOrNullProperties<T = object>(obj: T) {
	for(const key in obj) {
		if (obj[key] === null || obj[key] === undefined) delete obj[key];
	}
	return obj;
}
