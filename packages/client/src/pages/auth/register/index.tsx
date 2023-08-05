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
import { useMutation } from "react-query";
import { registerUser } from "../../../services/auth";
import ImageUploader from "../../../components/ui/ImageUploader";
import "./style.scss";

const Register: FC = () => {
  const { logIn } = authStore((state) => state);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserRegister>({
    resolver: yupResolver(RegisterValidationSchema),
    defaultValues: {
      username: "",
      password: "",
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

  const handleAvatarChange = (image: string) => {
    setValue("avatar", image);
  };
  const { mutate: registerMutation, isLoading } = useMutation((user: UserRegister) => {
    return registerUser(user);
  });

  const handleRegister = async (values: UserRegister) => {
    console.log("values", values);
    registerMutation(
      {
        username: values.username,
        password: values.password,
        role: values.role,
        age: values.age,
        avatar: values.avatar,
      },
      {
        onSuccess: (data: any) => {
          if (!data) {
            return alert("Could not create user");
          }
          logIn({
            userId: data.id,
            username: data.username,
            token: data.token,
            role: data.role,
            avatar: data.avatar,
          });
          navigate("/home");
        },
        onError: (error: any) => {
          alert(error.message);
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

  return (
    <form className="register-page-container" onSubmit={handleSubmit(handleRegister)}>
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

      <Dropdown options={options} onChange={handleRoleChange} error={errors.role?.message} />
      <DatePicker onChange={handleAgeChange} error={errors.age?.message} />
      <ImageUploader onChange={handleAvatarChange} name="avatar" label="Select Avatar" />
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
