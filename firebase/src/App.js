import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { db, storage } from "./firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	doc,
	deleteDoc,
} from "firebase/firestore";
import DataTable from "react-data-table-component";
import { Modal, Button } from "react-bootstrap";
function App({ logOut, user, setError }) {
	setError("");
	const listRef = ref(storage, "images");

	const columns = [
		{
			name: "display",
			cell: (row) => (
				<>
					<img src={row.image} width="100px" />
				</>
			),
		},

		{
			name: "Name",
			selector: (row) => row.name,
		},
		{
			name: "age",
			selector: (row) => row.age,
		},
		{
			name: "Mobile",
			selector: (row) => row.mobile,
		},
		{
			name: "Action",
			cell: (row) => (
				<div>
					<button
						id={row.ID}
						className="btn btn-outline-primary btn-sm"
						onClick={() => {
							viewData(row.id, row.name, row.age, row.mobile);

							handleShow();
						}}
					>
						view
					</button>
					<button
						id={row.ID}
						className="btn btn-outline-primary btn-sm"
						onClick={() => {
							editCall(row.id, row.name, row.age, row.mobile, row.image);
							console.log(row.image);
							setModalTitle("EDIT DATA");
							setModalFooter("SAVE EDITED DATA");
							handleShowAdd();
						}}
					>
						Edit
					</button>
					<button
						id={row.ID}
						className="btn btn-outline-primary btn-sm"
						onClick={() => {
							handleShowDelete(row.id);
						}}
					>
						Delete
					</button>
				</div>
			),
		},
	];

	// display image

	// get data from firebase
	const [users, setUsers] = useState([]);

	// for create user //
	const [newId, setNewId] = useState("");
	const [newName, setNewName] = useState("");
	const [newAge, setNewAge] = useState(0);
	const [mobileNUm, setMobileNum] = useState(0);
	// const [newImage, setNewImage] = useState("");

	const userCollectionRef = collection(db, "employee");

	const [modalTitle, setModalTitle] = useState("");
	const [modalFooter, setModalFooter] = useState("");
	const [viewSet, setViewSet] = useState({
		viewId: "",
		viewName: "",
		viewAge: "",
		viewMobile: "",
	});

	// view modal

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	// view modal-end

	// add - edit modal
	const [showADD, setShowADD] = useState(false);
	const handleCloseAdd = () => {
		setShowADD(false);
		setNewAge("");
		setMobileNum("");
		setNewName("");
	};
	const handleShowAdd = () => setShowADD(true);
	// add-edit modal end

	// delete modal

	const [showDelete, setShowDelete] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = (id) => {
		setDeleteId(id);
		setShowDelete(true);
	};

	// delete modal end
	// create user
	const [image, setImage] = useState(null);
	const [url, setUrl] = useState(null);
	const handleSubmit = () => {
		const imageRef = ref(storage, `images/${image.name}`);
		uploadBytes(imageRef, image)
			.then(() => {
				getDownloadURL(imageRef, image)
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
	const createUser = async () => {
		await addDoc(userCollectionRef, {
			image: url,
			name: newName,
			age: Number(newAge),
			mobile: Number(mobileNUm),
		});
		setImage("");
		setNewAge("");
		setMobileNum("");
		setNewName("");
	};

	const editCall = (id, name, age, mobile, image) => {
		setNewId(id);
		setNewName(name);
		setNewAge(age);
		setMobileNum(mobile);
		setUrl(image);
	};


new edit karyu hoy ee push km karvanu???





	const viewData = (id, name, age, mobile) => {
		setViewSet({
			viewId: id,
			viewName: name,
			viewAge: age,
			viewMobile: mobile,
		});
	};

	// update data
	const updateUser = async (id, name, age, mobile, image) => {
		console.log(image);
		const userDoc = doc(db, "employee", id);
		const newFields = { name, age, mobile, image };
		await updateDoc(userDoc, newFields);
	};

	// delete user
	const deleteUser = async (id) => {
		const userDoc = doc(db, "employee", id);
		await deleteDoc(userDoc, id);
	};

	useEffect(() => {
		const getUsers = async () => {
			const data = await getDocs(userCollectionRef);
			setUsers(
				data.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
		};
		getUsers();
	}, [userCollectionRef]);

	return (
		<>
			<header className="d-block my-3">
				<p className="ms-3 h3 d-inline">Welcome:- {user}</p>
				<button
					className="float-end btn btn-outline-secondary me-5 "
					onClick={() => {
						logOut();
						console.log("clicked logout");
					}}
				>
					Sign OUT
				</button>
			</header>
			<div className="App">
				<div className="table-div">
					<DataTable columns={columns} data={users} />
				</div>

				<div className=" d-flex justify-content-center align-items-center create-div ">
					{/*view modal  */}

					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>View Data</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>Name:{viewSet.viewName}</p>
							<p>Age:{viewSet.viewAge}</p>
							<p>Mobile Num:{viewSet.viewMobile}</p>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
					{/* view modal end */}

					{/* add-edit modal */}
					<div>
						<Button
							variant="outline-primary"
							onClick={() => {
								handleShowAdd();
								setModalTitle("ADD DATA");
								setModalFooter("CREATE USER");
							}}
						>
							ADD NEW DATA
						</Button>
						<Modal show={showADD} onHide={handleCloseAdd}>
							<Modal.Header closeButton>
								<Modal.Title>{modalTitle}</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<>
									<img src={url} />
									<input
										type="file"
										placeholder=" select image..."
										onChange={(event) => {
											setImage(event.target.files[0]);
										}}
									/>
									<button onClick={handleSubmit}>Upload</button>
									<br />
									<label>Name:</label>
									<input
										type="text"
										placeholder="Name..."
										value={newName}
										onChange={(event) => {
											setNewName(event.target.value);
										}}
									/>
									<br />
									<label>Age:</label>
									<input
										type="number"
										placeholder="Age..."
										value={newAge}
										onChange={(event) => {
											setNewAge(event.target.value);
										}}
									/>
									<br />
									<label>Mobile number:</label>
									<input
										type="tel"
										placeholder="mobile number..."
										onChange={(event) => {
											setMobileNum(event.target.value);
										}}
										value={mobileNUm}
									/>
									<br />
								</>
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="secondary"
									onClick={() => {
										if (modalTitle == "EDIT DATA") {
											updateUser(newId, newName, newAge, mobileNUm, url);
											setUrl("");
											setNewAge("");
											setMobileNum("");
											setNewName("");
											handleCloseAdd();
										} else if (modalTitle == "ADD DATA") {
											createUser();
											handleCloseAdd();
										}
									}}
								>
									{modalFooter}
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
					{/* add-edit modal end */}

					{/* delete modal */}

					<Modal show={showDelete} onHide={handleCloseDelete}>
						<Modal.Header closeButton>
							<Modal.Title>DELETE</Modal.Title>
						</Modal.Header>
						<Modal.Body>Are You Sure .....</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleCloseDelete}>
								Close
							</Button>
							<Button
								variant="primary"
								onClick={() => {
									deleteUser(deleteId);
									handleCloseDelete();
								}}
							>
								DELETE
							</Button>
						</Modal.Footer>
					</Modal>

					{/* delete modal end */}
				</div>
			</div>
		</>
	);
}

export default App;
