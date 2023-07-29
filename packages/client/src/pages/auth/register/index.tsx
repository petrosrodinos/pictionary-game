import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { BiRegistered } from "react-icons/bi";
import Input from "../../../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RegisterValidationSchema } from "../../../validation-schemas/user";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/ui/Dropdown";
import DatePicker from "../../../components/ui/DatePicker";
import Label from "../../../components/ui/Label";
import { useMutation } from "react-query";
import { registerUser } from "../../../services/auth";
import "./style.scss";
import ImageUploader from "../../../components/ui/ImageUploader";

const Register: FC = () => {
  const { logIn } = authStore((state) => state);
  const navigate = useNavigate();

  const {
    register, //einai diko toy onoma den exei na kanei me to button
    handleSubmit, // toy library
    formState: { errors },
    setValue,
  } = useForm<UserRegister>({
    resolver: yupResolver(RegisterValidationSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
      email: "",
      role: "",
      age: "",
      avatar: "",
    },
  });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("role", e.target.value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLDataElement>) => {
    setValue("age", e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("avatar", e.target.value);
  };
  const { mutate: registerMutation, isLoading } = useMutation(
    (user: UserRegister) => {
      return registerUser(user);
    }
  );

  const handleRegister = async (values: UserRegister) => {
    console.log("values", values);
    registerMutation(
      {
        username: values.username,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        email: values.email,
        role: values.role,
        age: values.age,
        avatar: values.avatar,
      },
      {
        onSuccess: (data: any) => {
          console.log("values", values);
          logIn({
            userId: data.id,
            username: data.username,
            token: data.token,
            role: data.role,
            avatar: data.avatar,
          });
          navigate("auth/login");
          //navigate("/home"); AYTO THELEI KANONIKA GIA AFTO EXO KAI TO TOKEN ALOSTE
        },
        onError: (error: any) => {
          alert(error.message);

          // alert("username already exists");
        },
      }
    );
  };
  const options = [
    { value: "Role", label: "Role" },
    { value: "Student", label: "Student" },
    { value: "Teacher", label: "Teacher" },
    { value: "Parent", label: "Parent" },
  ];

  //edw bazw ta props
  return (
    <form
      className="register-page-container"
      onSubmit={handleSubmit(handleRegister)}
    >
      <Typography variant="sub-header-main">Register</Typography>
      <Input
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder="Username"
      />

      <Input
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder="Password"
        type="password"
      />
      <Input
        error={errors.passwordConfirmation?.message}
        name="passwordConfirmation"
        register={register}
        placeholder="Confirm Password"
        type="password"
      />
      <Input
        error={errors.email?.message}
        name="email"
        register={register}
        placeholder="Email"
      />

      <Dropdown
        options={options}
        onChange={handleRoleChange}
        error={errors.role?.message}
      />
      <Label value="Select your birthday:" />
      <DatePicker onChange={handleAgeChange} error={errors.age?.message} />
      <Label value="Upload avatar image :" />
      <ImageUploader
        onChange={handleAvatarChange}
        error={errors.avatar?.message}
        name="avatar"
      />
      <Button
        type="submit"
        loading={isLoading}
        icon={BiRegistered}
        title="Register"
        variant="primary"
      />
    </form>
  );
};

export default Register;
