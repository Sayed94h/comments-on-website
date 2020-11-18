"use strict";

const fs = require("fs");
const path = require("path");
const tv4 = require("tv4");
const config = require("../config");

const SCHEMA = path.join(__dirname, "/..", config.DATA_DIR, "/_-schema.json");
const DATA_PATH = path.join(__dirname, "/..", config.DATA_DIR, "/_-data.json");

const controllers = {
	hello: (req, res) => {
		res.json({ message: "Thank you for visiting our website!" });
	},
	displayComments: async (req, res, next) => {
		await fs.readFile(DATA_PATH, "UTF-8", (err, data) => {
			if (err) {
				console.error("Error from the read file display comments: ", err);
				res.json({
					message: "There are some problems to read and render the comments",
				});
				return;
			}
			// if there is no error
			let parsedData = JSON.parse(data);
			res.send(parsedData.comments);
		});
	},
	saveComments: async (req, res, next) => {
		// get users comments and names
		let comment = req.body.comment;
		let name = req.body.name;
		await fs.readFile(DATA_PATH, "UTF-8", (err, data) => {
			// in case there is an error
			if (err) {
				console.error("Error from read file in saveComments handler: ", err);
				res.json({ message: "Something went wrong\nPlease try again" });
				return;
			}

			// parse the data
			let parsedData = JSON.parse(data);
			let toSave = {
				id: parsedData.nextId,
				name: name,
				comment: comment,
			};
			// check if users data is valid based on our schema
			let isValid = tv4.validate(toSave, SCHEMA);
			// if it is not valid, then let users know what wrong is about their inputs
			if (!isValid) {
				const error = tv4.error;
				console.error("Error from validation: ", error);
				res.status(400).json({
					error: {
						message: error.message,
						dataPath: error.dataPath,
					},
				});
				return;
			}
			// if users inputs are valid then do the following

			parsedData.nextId++;
			// push or send the users data to the database
			parsedData.comments.push(toSave);
			let toWrite = JSON.stringify(parsedData, null, " ");
			// save changes
			fs.writeFile(DATA_PATH, toWrite, (err) => {
				if (err) {
					console.error("Error from writeFile saveComments: ", err);
					res.json({
						message: `Sorry, we could not save your comment:\nComment: ${comment}\nName: ${name}\nPlease try again`,
					});
					return;
				}
				res.json({
					message: `Your comment has been saved:\nComment: ${comment}\nName: ${name}\n`,
				});
			});
		});
	},
	editComments: async (req, res, next) => {
		// get users comments and names
		let comment = req.body.comment;
		let name = req.body.name;
		let id = Number(req.body.id);
		await fs.readFile(DATA_PATH, "UTF-8", (err, data) => {
			// in case there is an error
			if (err) {
				console.error("Error from read file in editComments handler: ", err);
				res.json({ message: "Something went wrong\nPlease try again" });
				return;
			}

			// parse the data
			let parsedData = JSON.parse(data);
			let toEdit = parsedData.comments.filter((item) => {
				if (item.id === id) {
					return item;
				}
			});
			// Edit the comment or change the comment
			toEdit[0].comment = comment;

			let toWrite = JSON.stringify(parsedData, null, " ");
			// save changes
			fs.writeFile(DATA_PATH, toWrite, (err) => {
				if (err) {
					console.error("Error from writeFile editComments: ", err);
					res.json({
						message: `Sorry, we could not edit your comment:\nComment: ${comment}\nName: ${name}\nPlease try again`,
					});
					return;
				}
				res.json({
					message: `Your comment has been edited:\nComment: ${comment}\nName: ${name}\n`,
				});
			});
		});
	},
	deleteComments: async (req, res, next) => {
		// get comment id
		let id = Number(req.body.id);
		await fs.readFile(DATA_PATH, "UTF-8", (err, data) => {
			// in case there is an error
			if (err) {
				console.error("Error from read file in deleteComments handler: ", err);
				res.json({ message: "Something went wrong\nPlease try again" });
				return;
			}

			// parse the data
			let parsedData = JSON.parse(data);
			let toDelete = parsedData.comments.filter((item) => {
				if (item.id === id) {
					return item;
				}
			});
			// find the index number of the comment that you want to delete
			let index = parsedData.comments.indexOf(toDelete[0]);
			// Delete the comment
			parsedData.comments.splice(index, 1);

			let toWrite = JSON.stringify(parsedData, null, " ");
			// save changes
			fs.writeFile(DATA_PATH, toWrite, (err) => {
				if (err) {
					console.error("Error from writeFile deleteComments: ", err);
					res.json({
						message: `Sorry, we could not delete your comment\nPlease try again`,
					});
					return;
				}
				res.json({
					message: `Your comment has been deleted`,
				});
			});
		});
	},
};

module.exports = controllers;
