import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getAuth, updatePassword, updateProfile } from "firebase/auth";

function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChangePassword = () => {
    const user = getAuth().currentUser;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    updatePassword(user, newPassword)
      .then(() => {
        setSuccessMessage("Password updated successfully.");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleUpdateProfile = () => {
    const user = getAuth().currentUser;

    updateProfile(user, { displayName: displayName })
      .then(() => {
        setSuccessMessage("Profile updated successfully.");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Update Profile
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="display-name"
        label="Display Name"
        value={displayName}
        onChange={(e) => handleInputChange(e, setDisplayName)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="current-password"
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => handleInputChange(e, setCurrentPassword)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="new-password"
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => handleInputChange(e, setNewPassword)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirm-password"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => handleInputChange(e, setConfirmPassword)}
      />
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      {successMessage && <Typography variant="body2" color="success">{successMessage}</Typography>}
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={handleUpdateProfile}
      >
        Update Profile
      </Button>
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
      >
        Change Password
      </Button>
    </div>
  );
}

export default Profile;
