import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out:'./server/build'
		}),
		env:{
			// port:5000
		}
	}
};

export default config;
