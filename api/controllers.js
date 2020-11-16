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
};

module.exports = controllers;
