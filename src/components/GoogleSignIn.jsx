import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '../firebase';

const GoogleSignIn = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google auth successful, credential:', credentialResponse);
      
      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          credential: credentialResponse.credential,
          clientId: credentialResponse.clientId 
        }),
        credentials: 'include',
        mode: 'cors'
      });
  
      console.log('Auth response status:', response.status);
      
      const data = await response.json();
      console.log('Auth response data:', data);
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      const auth = getAuth(app);
      try {
        console.log('Attempting Firebase sign-in with custom token');
        const userCredential = await signInWithCustomToken(auth, data.customToken);
        console.log('Firebase auth success:', userCredential.user);
        window.location.href = '/dashboard';
      } catch (firebaseError) {
        console.error('Firebase sign-in failed:', firebaseError);
        throw new Error('Firebase authentication failed: ' + firebaseError.message);
      }
    } catch (error) {
      console.error('Full authentication error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId="919979525803-4tp3gnsaqqtguv9qjledtf1rpccke5jm.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google login failed')}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};
export default GoogleSignIn;