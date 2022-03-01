import React, { useState } from "react";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";
import App from "./App";
import "./Authentication.css";
const Authentication = () => {
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");

	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [error, setError] = useState("");
	const [user, setUser] = useState({});

	onAuthStateChanged(auth, (currentUser) => {
		setUser(currentUser);
	});
	const register = async () => {
		try {
			const user = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
		} catch (error) {
			console.log(error);
		}
	};

	const logIn = async () => {
		try {
			const user = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
		} catch (error) {
			setError(error.code);
			console.log(error.code);
		}
	};

	const logOut = async () => {
		await signOut(auth);
	};

	return (
		<>
			{user ? (
				<App logOut={logOut} user={user?.email} setError={setError} />
			) : (
				<div>
					{/* <div>
						<h3>Register User</h3>
						<input
							placeholder="Email..."
							onChange={(event) => {
								setRegisterEmail(event.target.value);
							}}
						/>
						<input
							placeholder="Password..."
							onChange={(event) => {
								setRegisterPassword(event.target.value);
							}}
						/>
						<button
							onClick={() => {
								register();
							}}
						>
							Create User
						</button>
					</div> */}

					<div className="container  d-flex justify-content-center align-items-center loginClass">
						<div>
							<h3>Login</h3>
							<input
								className="my-3"
								placeholder="Email..."
								onChange={(event) => {
									setLoginEmail(event.target.value);
								}}
							/>

							<br />
							<input
								placeholder="Password..."
								onChange={(event) => {
									setLoginPassword(event.target.value);
								}}
							/>
							<p className="text-danger">{error}</p>

							<button
								className="btn btn-outline-success mt-4 float-end"
								onClick={() => {
									logIn();
								}}
							>
								Login
							</button>
						</div>
					</div>

					{/* <h4>User Logged In:</h4>
					
					<button
						onClick={() => {
							logOut();
							console.log("clicked logout");
						}}
					>
						Sign OUT
					</button> */}
				</div>
			)}
		</>
	);
};

export default Authentication;
