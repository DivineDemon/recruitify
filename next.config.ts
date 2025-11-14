import "./src/env.ts";

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
			},
			{
				hostname: "utfs.io",
				protocol: "https",
			},
			{
				hostname: "gravatar.com",
				protocol: "https",
			},
		],
	},
};

export default config;
