const dataLayer = () => window.dataLayer || [];

// Invoke the embedded Google Tag Manager hook in index.html
export const create = (gtmId) => {
	if (gtmId && window.gtmCreate && window.gtmCreate.call) {
		window.gtmCreate(gtmId);
		window.gtmCreate = undefined;
	}
};

export const pushEvent = (eventName, data) => dataLayer().push({ event: eventName, ...data });
