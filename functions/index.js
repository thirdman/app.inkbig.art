// The Firebase Admin SDK to access the Firebase Realtime Database.
const functions = require("firebase-functions");

const admin = require("firebase-admin");
require("isomorphic-fetch");
const request = require("request");
const cors = require("cors")({ origin: true });

const printfulApiKey = "0l91417i-cbp6-69f4:e352-2w2zhu2f9yv2";
const corsOptions = {
	origin: [
		"https://app.inkbig.app",
		"http://localhost/",
		"http://localhost:8080"
	],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

admin.initializeApp(functions.config().firebase);

// const { printfulApiKey } = AppConfig;

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// PRINTFUL
exports.printfulApi = functions.https.onRequest((req, res) => {
	// console.log("this is the printful api request", req, res);
	cors(req, res, () => {
		console.log("---");
		const endpoint = req.query.endpoint;
		const body = req.query.body; // possibly unused
		const url = req.query.url;
		const bodyObj = req.query.bodyObj;
		// console.log("endpoint", endpoint);
		// console.log("url", url);
		// console.log("bodyObj", bodyObj);
		const apiUrl = "https://api.printful.com";
		const apiEndpoint = endpoint || "/products/71";
		const apiRequestString = apiUrl + "/" + apiEndpoint;
		const apiBody = bodyObj || "id=171";
		const tempBodyObj = {
			variant_ids: [6876, 6880, 7845],
			format: "jpg",
			files: [
				{
					placement: "default",
					image_url:
						"https://cdn.shopify.com/s/files/1/2477/7864/products/MflOzOcJTIGISpbRtW7c_Auckland-One-Tree-Hill_R-Artemis_Circlrcrop_circle_pri_mockup_Person_Person_12x18_84f19493-12d0-4399-a5aa-f6c549205922_360x.jpg?v=1545132007"
				}
			]
		};
		const tempApiBody = JSON.stringify(tempBodyObj);
		console.log("apiBody", apiBody);
		// console.log("tempApiBody", tempApiBody);
		// console.log("apiEndpoint:", apiEndpoint);
		// console.log("apiRequestString:", apiRequestString);

		// const printfulApiKey = "1234";
		const base64Key = Buffer.from(printfulApiKey).toString("base64");
		// console.log("base64Key:", base64Key);
		// console.log("base64Key encoded: ", base64Key);
		// Where we're fetching data from
		// fetch(`https://api.printful.com/mockup-generator/create-task/171`, {
		const options = {
			// method: "post",
			method: "get",
			headers: {
				Authorization: `Basic MGw5MTQxN2ktY2JwNi02OWY0OmUzNTItMncyemh1MmY5eXYy`
				// content-Type: 'application/x-www-form-urlencoded'
				// "content-type": "application/json"
			},
			body: apiBody
		};

		var requestObject = {
			// host: apiUrl,
			// path: apiEndpoint,
			uri: apiRequestString,
			method: "GET",
			headers: {
				Authorization: "Basic " + base64Key
				// 'Content-Type': 'application/json'
			},
			body: apiBody
		};

		request(requestObject, (error, response, body) => {
			console.log("error:", error);
			console.log("response:", response);
			console.log("body:", body);
			if (!error && response.statusCode === 200) {
				console.log("cors body:", body);
				res.send(response);
				const objBody = JSON.parse(body);
				console.log("cors objBody:", objBody);
			}
			if (error) {
				console.log("error:", error);
				res.send(error);
			}
		});

		/*
		fetch(`https://api.printful.com/products/171`, { options })
			// We get the API response and receive data in JSON format...
			.then(response => {
				console.log("response: ", response);
				response.json();
				console.log("response for fetch: ", response);
				console.log("response body for fetch: ", response.body);
				// console.log("parse response: ", JSON.parse(response.body));
				res.send(response.body);
				return response;
			})
			// Catch any errors we hit and update the app
			.catch(error => {
				console.error("error: ", error);
				console.log("error for fetch: ", error);
				res.send(error);
				return error;
			});
*/
	});
});
