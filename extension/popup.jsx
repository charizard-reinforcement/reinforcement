import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
	Navigate,
	Link,
	HashRouter,
	RouterProvider,
} from 'react-router';

const App = () => {
	const [credential, setCredential] = useState({
		username: '',
		password: '',
		email: '',
		firstName: '',
		lastName: '',
	});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const backendUrl = 'http://localhost:3000';

	const router = HashRouter([
		{
			path: '/popup',
			element: isLoggedIn ? (
				<Popup
					firstName={credential.firstName}
					lastName={credential.lastName}
				/>
			) : (
				<Navigate to={'/'} />
			),
		},
		{
			path: '/signup',
			element: (
				<SignUpContainer
					credential={credential}
					setCredential={setCredential}
				/>
			),
		},
		{
			path: '/',
			element: (
				<LoginPage
					credential={credential}
					setCredential={setCredential}
					isLoggedIn={isLoggedIn}
					setIsLoggedIn={setIsLoggedIn}
					backendUrl={backendUrl}
				/>
			),
		},
	]);

	return (
		<div id='app'>
			<RouterProvider router={router} />
		</div>
	);
};

function LoginPage({
	credential,
	setCredential,
	isLoggedIn,
	setIsLoggedIn,
	backendUrl,
}) {
	// const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		console.log('Initiating handleLogin...');
		try {
			console.log(`Sending requests to '${backendUrl}/user/login'...`);
			const body = {
				username: credential.username,
				password: credential.password,
			};

			const response = await fetch(backendUrl + '/user/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ body }),
			});

			if (!response.ok) {
				console.error(response.statusText);
				setIsLoggedIn(false);
			}

			const data = await response.json();
			console.log(data.message);
			setIsLoggedIn(data.data.approved);
			setCredential((prev) => ({
				...prev,
				username: '',
				password: '',
			}));
			// navigate('/popup');
		} catch (error) {
			console.error(error);
			setIsLoggedIn(false);
		}
	};

	return (
		<div>
			{isLoggedIn ? (
				<div>
					<h2>Welcome, {credential.username}!</h2>
					<button onClick={handleLogout}>Logout</button>
					<Popup />
				</div>
			) : (
				<div>
					<h2>Login Page</h2>
					<div>
						<input
							type='text'
							value={credential.username}
							placeholder='Username'
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div>
						<input
							type='password'
							value={credential.password}
							placeholder='Password'
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button onClick={handleLogin}>Login</button>
					<Link to={'/signup'}>
						<button>Sign Up</button>
					</Link>
				</div>
			)}
		</div>
	);
}

const SignUpContainer = ({ credential, setCredential, backendUrl }) => {
	const handleSignUp = async (e) => {
		e.preventDefault();
		console.log('Initiating handleSignUp...');
		try {
			const body = {
				username: credential.username,
				password: credential.password,
				email: credential.email,
				firstName: credential.firstName,
				lastName: credential.email.lastName,
			};
			console.log(`Sending requests to '${backendUrl}/user/signup'...`);

			const response = await fetch(backendUrl + '/user/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				console.error(response.statusText);
			}

			const data = await response.json();
			console.log(data.message);
			setCredential((prev) => ({
				...prev,
				username: '',
				password: '',
				email: '',
				firstName: '',
				lastName: '',
			}));
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div id='signup-container' className='flex flex-col'>
			<div id='signup-form' className='flex flex-col'>
				<input
					type='text'
					value={credential.username}
					placeholder='Username'
					onChange={(e) => e.target.value}
				/>
				<input
					type='password'
					value={credential.password}
					placeholder='Password'
					onChange={(e) => e.target.value}
				/>
				<input
					type='email'
					value={credential.email}
					placeholder='Email'
					onChange={(e) => e.target.value}
				/>
				<input
					type='text'
					value={credential.firstName}
					placeholder='First Name'
					onChange={(e) => e.target.value}
				/>
				<input
					type='text'
					value={credential.lastName}
					placeholder='Last Name'
					onChange={(e) => e.target.value}
				/>
			</div>
      <button>Sign Up</button>
		</div>
	);
};

// export default LoginPage;

// function Popup() {
//   return (
//     <div>
//       <h1>My Chrome Extension</h1>
//     </div>
//   );
// }

function Popup() {
	const [clipboardHistory, setClipboardHistory] = useState([]);

	useEffect(() => {
		console.log('Popup opened - fetching clipboard history');
		// Load clipboard history when popup opens
		chrome.storage.local.get(['clipboardHistory'], (result) => {
			console.log(
				'Retrieved clipboard history:',
				result.clipboardHistory
			);
			if (result.clipboardHistory) {
				setClipboardHistory(result.clipboardHistory);
			}
		});
	}, []);

	const copyToClipboard = (text) => {
		console.log('Copying to clipboard:', text);
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log('Successfully copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy to clipboard:', err);
			});
	};

	console.log('Current clipboard history state:', clipboardHistory);

	return (
		<div className='p-4 w-80'>
			<h1 className='text-xl font-bold mb-4'>Clipboard History</h1>
			<div className='space-y-2'>
				{clipboardHistory.length === 0 ? (
					<p className='text-gray-500'>
						No items in clipboard history
					</p>
				) : (
					clipboardHistory.map((item, index) => (
						<div
							key={index}
							className='p-2 border rounded hover:bg-gray-100 cursor-pointer group'
							onClick={() => copyToClipboard(item)}
						>
							<p className='truncate'>{item}</p>
							<p className='text-xs text-gray-500'>
								Click to copy
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
