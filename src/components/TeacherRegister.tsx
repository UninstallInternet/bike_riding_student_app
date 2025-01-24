"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Avatar from "@mui/material/Avatar";
// import { Upload } from "lucide-react";
import { supabase } from "../lib/supabase";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export default function TeacherRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (credentials: SignUpWithPasswordCredentials) => {
    if (!("email" in credentials)) return;
    const { email, password } = credentials;
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.log(error.message);
    console.log(data);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSignUp({ email, password });

    console.log("Form submitted:");
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Teacher Registration
        </Typography>

        {/* <Avatar
          src={
            formData.picture ? URL.createObjectURL(formData.picture) : undefined
          }
          sx={{ width: 100, height: 100, mb: 2 }}
        /> */}

        {/* <Button
          component="label"
          variant="outlined"
          startIcon={<Upload size={20} />}
          sx={{
            mb: 2,
            borderRadius: "12px",
            textTransform: "none",
          }}
        >
          Upload Picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handlePictureChange}
          />
        </Button> */}

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: "12px",
            textTransform: "none",
            py: 1.5,
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}
