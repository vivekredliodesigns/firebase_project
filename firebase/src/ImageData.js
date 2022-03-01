import React, { useState, useEffect } from "react";
import { storage } from "./firebase-config";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	getStorage,
	listAll,
} from "firebase/storage";
const ImageData = () => {
	const [image, setImage] = useState(null);
	const [url, setUrl] = useState(null);
	const [urlListTest, setUrlListTest] = useState([]);

	const handleImageChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	// useEffect(() => {
	// 	const listRef = ref(storage, "images");
	// 	listAll(listRef)
	// 		.then((res) => {
	// 			setUrlListTest(res.items);
	// 			res.items.forEach((itemRef) => {
	// 				getDownloadURL(itemRef).then((url) => {
	// 					setUrlListTest(url);
	// 					// console.log(urlListTest);
	// 				});
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			// Uh-oh, an error occurred!
	// 		});
	// }, []);
	// console.log(urlListTest);
	const handleSubmit = () => {
		const imageRef = ref(storage, `images/${image.name}`);

		uploadBytes(imageRef, image)
			.then(() => {
				getDownloadURL(imageRef)
					.then((url) => {
						setUrl(url);
						
						
					})
					.catch((error) => {
						console.log(error.message, "error getting the image url");
					});

				setImage(null);
			})
			.catch((error) => {
				console.log(error.message);
			});
		
	};

	return (
		<>
			<div className="App">
				<center>
					<img src={url} width="200px" />
					<input type="file" onChange={handleImageChange} />
					<button onClick={handleSubmit}>Upload</button>
				</center>
			</div>
			{urlListTest.map((src, id) => {
				console.log("hello");
				return (
					<div key={id}>
						<img src={src} alt=" image" />
						{console.log("in map")}
					</div>
				);
			})}
		</>
	);
};

export default ImageData;
