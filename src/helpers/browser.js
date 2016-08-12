export const setLocationHref = url => {
	if (typeof window !== 'undefined') {
		window.location.href = url;
	}
};
