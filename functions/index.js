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
		const endpoint = req.query.endpoint;
		const body = req.query.body;
		const url = req.query.url;
		const bodyObj = req.query.bodyObj;
		console.log("endpoint", endpoint);
		console.log("url", url);
		console.log("bodyObj", bodyObj);
		const apiUrl = "https://api.printful.com";
		const apiEndpoint = endpoint || "/products/171";
		const apiRequestString = apiUrl + apiEndpoint;
		const apiBody = body || "id=171";
		// const printfulApiKey = "1234";
		const base64Key = Buffer.from(printfulApiKey).toString("base64");
		// console.log("base64Key encoded: ", base64Key);
		// Where we're fetching data from
		// fetch(`https://api.printful.com/mockup-generator/create-task/171`, {

		const options = {
			// method: "post",
			method: "get",
			headers: {
				Authorization: `Basic ${base64Key}`,
				// content-Type: 'application/x-www-form-urlencoded'
				"content-type": "application/json"
			},
			body: apiBody
			/*
		body: {
			product_id: 171,
			variant_ids: [6876, 6880, 7845],
			format: "jpg",
			files: [
				{
					placement: "front",
					image_url:
						"https://firebasestorage.googleapis.com/v0/b/inkbig-717ee.appspot.com/o/renders%2FAucklandOneTreeHill_bluePeach_circle_medium.jpg?alt=media&token=2e88be10-bd2b-4c70-a360-d909f8656d63",
					position: {
						area_width: 1800,
						area_height: 2400,
						width: 1800,
						height: 1800,
						top: 300,
						left: 0
					}
				}
			]
		}
*/
		};

		request(apiRequestString, (error, response, body) => {
			console.log("error, response, body", error, response, body);
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
