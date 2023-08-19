import { FC, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  EditProfileValidationSchema,
  RegisterValidationSchema,
} from "../../../validation-schemas/user";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../../components/ui/Dropdown";
import DatePicker from "../../../components/ui/DatePicker";
import { useMutation } from "react-query";
import { registerUser, updateUser } from "../../../services/user";
import ImagePicker from "../../../components/ui/ImagePicker";
import { BsPerson } from "react-icons/bs";
import { NewUser, UserToUpdate } from "../../../interfaces/typing";
import "./style.scss";

interface RegisterProps {
  values?: NewUser;
  isEditing?: boolean;
}

const Register: FC<RegisterProps> = ({ isEditing, values }) => {
  const { logIn, userId, updateProfile } = authStore((state) => state);
  const navigate = useNavigate();

  const { mutate: registerMutation, isLoading } = useMutation((user: NewUser) => {
    return registerUser(user);
  });

  const { mutate: updateUserMutation, isLoading: isUpdating } = useMutation(
    (user: UserToUpdate) => {
      return updateUser(user);
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<NewUser>({
    resolver: yupResolver(isEditing ? EditProfileValidationSchema : RegisterValidationSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "",
      age: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (values) {
      reset({
        username: values.username,
        password: "",
        role: values.role,
        age: values.age,
        avatar: values.avatar,
      });
    }
  }, [values]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("role", e.target.value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLDataElement>) => {
    setValue("age", e.target.value);
  };

  const handleAvatarChange = (image: string) => {
    setValue("avatar", image);
  };

  const handleRegister = async (values: NewUser) => {
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

  const handleSave = async (values: NewUser) => {
    updateUserMutation(
      {
        username: values.username,
        role: values.role,
        age: values.age,
        avatar: values.avatar,
        userId: userId,
      },
      {
        onSuccess: (data: any) => {
          if (!data) {
            return alert("Could not update profile");
          }
          updateProfile({
            username: data.username,
            role: data.role,
            age: data.age,
            avatar: data.avatar,
          });
          alert("Profile updated successfully");
        },
        onError: (error: any) => {
          alert(error.message);
        },
      }
    );
  };

  const options = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "parent", label: "Parent" },
  ];

  return (
    <form
      className="register-page-container"
      onSubmit={handleSubmit(isEditing ? handleSave : handleRegister)}
    >
      <Typography variant="sub-header-main">{isEditing ? "Edit Profile" : "Register"}</Typography>
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

      <Dropdown
        value={values?.role || ""}
        options={options}
        onChange={handleRoleChange}
        error={errors.role?.message}
        label="Choose role"
      />
      <DatePicker
        max={new Date().toISOString().slice(0, 10)}
        value={values?.age}
        onChange={handleAgeChange}
        error={errors.age?.message}
      />
      <ImagePicker
        value={values?.avatar}
        onChange={handleAvatarChange}
        name="avatar"
        label="Select Avatar"
      />
      <Button
        type="submit"
        loading={isLoading || isUpdating}
        icon={BsPerson}
        title={isEditing ? "Save" : "Register"}
        variant="primary"
      />
    </form>
  );
};

export default Register;
