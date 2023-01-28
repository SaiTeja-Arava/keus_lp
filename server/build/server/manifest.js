const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/alexa.png","images/app.png","images/bedRoom.png","images/console.png","images/googleHome.png","images/hall.jpg","images/hkit.png","images/img1.png","images/img10.png","images/img11.png","images/img12.png","images/img2.png","images/img3.png","images/img4.png","images/img5.png","images/img6.png","images/img7.png","images/img8.png","images/img9.png","images/logo.png","images/section.png","images/voice.png","images/wizard.png","videos/baba/poster.jpg","videos/homes/1/poster.jpg","videos/homes/2/poster.jpg","videos/homes/3/poster.jpg","videos/naveenPanuganti/poster.jpg","videos/neelesh/poster.jpg","videos/priyanka/poster.jpg","videos/sravanthiKollur/poster.jpg","videos/suprajaRao/poster.jpg","videos/vaishnaviLinga/poster.jpg"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg"},
	_: {
		entry: {"file":"_app/immutable/start-16db5279.js","imports":["_app/immutable/start-16db5279.js","_app/immutable/chunks/index-75d49590.js","_app/immutable/chunks/singletons-800a5cc7.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-264b6a16.js'),
			() => import('./chunks/1-e743c9ca.js'),
			() => import('./chunks/2-cd79277a.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

export { manifest };
//# sourceMappingURL=manifest.js.map
