import { useState } from "react";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

import FormInput from "../form-input/form-input.component";
import "./sign-up-form.styles.scss";
import Button from "../button/button.component";

const defaultFormField = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormField);
  const { displayName, email, password, confirmPassword } = formFields;

  //   Reset lại form
  const resetForm = () => {
    setFormFields(defaultFormField);
  };

  //   Xử lí submit form
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    // Kiểm tra xem password với confirmpassword có trùng nhau không
    if (password !== confirmPassword) {
      alert("Password do not match!");
      return;
    }

    try {
      // Gọi createAuthUserWithEmailAndPassword ở firebase file để thực hiện việc authenciated email password trên firebase
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      //   Gọi createUserDocumentFromAuth và truyền {displayName} để lưu trữ displayName trên firebase
      await createUserDocumentFromAuth(user, { displayName });

      resetForm();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encounter an error", error);
      }
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>

      <form onSubmit={() => {}}>
        <FormInput
          label="Display Name"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />

        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <Button type="submit" onClick={handleSubmit}>
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
