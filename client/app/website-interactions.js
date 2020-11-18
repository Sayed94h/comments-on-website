"use strict";

/**
 *      Get HTML Elements
 */

// users Comment
let userComments = document.getElementById("user-comment");
// users Name
let userName = document.getElementById("user-name");
// Submit Button
let submitComments = document.getElementById("submit-button");
// Render Box (Display users comments)
let displayBox = document.getElementById("comment-box");

/**
 * Read and render the comments
 */
const readRender = async () => {
	displayBox.innerHTML = "";
	const res = await fetch(`/api/comments`);
	const data = await res.json();
	// create elements to edit and delete comments and display these elements when the users click on "⁝" button
	let editDeleteSection = document.createElement("section");
	editDeleteSection.className = "edit-delete-section";
	let editButton = document.createElement("button");
	editButton.textContent = " Edit ";

	let deleteButton = document.createElement("button");
	deleteButton.textContent = " Delete ";
	editDeleteSection.appendChild(editButton);
	editDeleteSection.appendChild(deleteButton);
	// for each comment run the following codes
	for (let i = 0; i < data.length; i++) {
		let mainSection = document.createElement("section");
		let profileSection = document.createElement("section");

		let profileIcon = document.createElement("span");
		profileIcon.textContent = " 👤  ";
		let profileName = document.createElement("span");
		profileName.textContent = `  ${data[i].name} `;
		profileSection.appendChild(profileIcon);
		profileSection.appendChild(profileName);
		// store the id of each comment
		let idContainer = document.createElement("span");
		idContainer.innerHTML = `${data[i].id}`;
		// section comment
		let commentSection = document.createElement("section");
		commentSection.className = "commentSection";
		let commentSpan = document.createElement("span");
		let commentItself = document.createElement("p");
		commentItself.textContent = ` ${data[i].comment}`;
		// for editing comments
		let editSpan = document.createElement("span");
		let editComment = document.createElement("input");
		editComment.type = "text";
		editComment.value = ` ${data[i].comment}`;
		let saveButton = document.createElement("input");
		saveButton.type = "button";
		saveButton.value = " Save ";
		commentSpan.appendChild(commentItself);
		editSpan.appendChild(editComment);
		editSpan.appendChild(saveButton);

		let buttonSpan = document.createElement("span");
		buttonSpan.className = "button-span";
		let buttonItself = document.createElement("button");
		buttonItself.textContent = ` ⁝ `;
		buttonItself.id = `button${i}`;
		buttonItself.className = "editDeleteButton";
		buttonSpan.appendChild(buttonItself);
		commentSection.appendChild(commentSpan);
		commentSection.appendChild(buttonSpan);
		// this element should be displayed when users click on the button
		let editDeleteSpan = document.createElement("span");
		// display edit delete button
		buttonItself.onclick = function () {
			editDeleteSpan.appendChild(editDeleteSection);
			commentSection.appendChild(editDeleteSpan);
			// display the edit box and not display the comment box, run the edit function
			editButton.onclick = function () {
				commentItself.style.display = "none";
				commentSpan.appendChild(editSpan);
				saveButton.onclick = function () {
					let name = `${data[i].name}`;
					let comment = `${editComment.value}`;
					editComments(name, comment, idContainer.innerHTML);
				};
			};
			// run the delete function

			deleteButton.onclick = function () {
				deleteComments(idContainer.innerHTML);
			};
		};

		// append the created elements in the web page
		mainSection.appendChild(profileSection);
		mainSection.appendChild(commentSection);
		displayBox.appendChild(mainSection);
	}
};

/**
 * Save comments in the database(JSON file)
 */
const saveComments = async () => {
	// stop the program if the inputs are empty
	if (userComments.value === "" || userName.value === "") {
		alert("Please Enter your comment and your name");
		return;
	}
	const res = await fetch(`/api/comments`, {
		method: "POST",
		body: JSON.stringify({
			comment: userComments.value,
			name: userName.value,
		}),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});
	// if response is not ok then let the developers know

	if (!res.ok) {
		console.log("Response is not ok, from saveComments: ", res);
		return;
	}

	const data = await res.json();

	alert(data.message);
	userComments.value = "";
	userName.value = "";
	readRender();
};
submitComments.onclick = saveComments;
/**
 * Delete comments from the database if users want to delete their comments
 */
const deleteComments = async (id) => {
	const res = await fetch(`/api/comments`, {
		method: "DELETE",
		body: JSON.stringify({
			id: id,
		}),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});

	// in case there is an error
	if (!res.ok) {
		console.log("Response is not ok, from deleteComments: ", res);
		return;
	}

	const data = await res.json();

	alert(data.message);
	readRender();
};
/**
 * Edit users comments if the users would like to edit their comments
 */
const editComments = async (name, comment, id) => {
	const res = await fetch(`/api/comments`, {
		method: "PUT",
		body: JSON.stringify({
			name: name,
			comment: comment,
			id: id,
		}),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});

	// in case there is an error
	if (!res.ok) {
		console.log("Response is not ok, from editComments: ", res);
		return;
	}

	const data = await res.json();

	alert(data.message);
	readRender();
};

// display comments on page load
readRender();
