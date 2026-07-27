import React, { useState } from 'react'

export default function Register() {
    const[formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "STUDENT"
    });

  return (
    <div>Register</div>
  )
}
