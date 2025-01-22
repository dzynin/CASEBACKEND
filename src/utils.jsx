// const BASE_URL_DEV = "http://localhost:3000";
// const BASE_URL_DEV = "http://localhost:8000";
const BASE_URL_DEV = "https://back.casebk.com";

export { BASE_URL_DEV };

export const fetchAuth = () => {
	const auth = JSON.parse(localStorage.getItem("authDetails"));
	if (
		!auth ||
		!auth.userId ||
		!auth.authToken ||
		!auth.userPublicId ||
		!auth.username ||
		!auth.fname ||
		!auth.lname ||
		!auth.city ||
		!auth.country ||
		!auth.organisation ||
		!auth.email ||
		!auth.expiry
	) {
		return null;
	}
	if (auth.expiry < Date.parse(new Date())) return null;
	return {
		authToken: auth.authToken,
		auth_token: auth.authToken,
		userId: auth.userId,
		userPublicId: auth.userPublicId,
		username: auth.username,
		email: auth.email,
		expiry: auth.expiry,
		fname: auth.fname,
		lname: auth.lname,
		city: auth.city,
		country: auth.country,
		organisation: auth.organisation,
	};
};
