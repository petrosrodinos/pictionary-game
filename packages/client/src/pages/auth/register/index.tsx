import { FC, useEffect, useState } from "react";
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
import TabMenu from "../../../components/ui/TabMenu";
import { IoIosSend } from "react-icons/io";
import SelectAvatar from "../../../components/SelectAvatar";
import Toast from "../../../components/ui/Toast";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface RegisterProps {
  values?: NewUser;
  isEditing?: boolean;
}

const Register: FC<RegisterProps> = ({ isEditing, values }) => {
  const { t } = useTranslation();
  const { logIn, userId, updateProfile } = authStore((state) => state);
  const [selectedOption, setSelectedOption] = useState<string>("upload");
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

  const avatarOptionChange = (data: { name: string; value: string }) => {
    setSelectedOption(data.value);
  };

  const handleRegister = async (values: NewUser) => {
    if (!values.avatar) {
      toast.warn("Please select an avatar");
      return;
    }
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
            toast.error("Could not register, please try later");
            return;
          }
          logIn({
            userId: data.id,
            username: data.username,
            token: data.token,
            role: data.role,
            avatar: data.avatar,
            xp: data.xp,
          });
          navigate("/home");
        },
        onError: (error: any) => {
          if (error) {
            toast.error(error);
          } else {
            toast.error("Could not register, please try later");
          }
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
        password: values.password,
      },
      {
        onSuccess: (data: any) => {
          if (!data) {
            toast.error("Could not update profile, please try later");
            return;
          }
          updateProfile({
            username: data.username,
            role: data.role,
            age: data.age,
            avatar: data.avatar,
          });
          toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
          if (error) {
            toast.error(error);
          } else {
            toast.error("Could not update profile, please try later");
          }
        },
      }
    );
  };

  const options = [
    { value: "student", label: t("student") },
    { value: "teacher", label: t("teacher") },
    { value: "parent", label: t("parent") },
  ];

  const avatarOptions = [
    {
      label: t("upload-avatar"),
      value: "upload",
    },
    {
      label: t("select-avatar"),
      value: "select",
    },
  ];

  return (
    <form
      className="register-page-container"
      onSubmit={handleSubmit(isEditing ? handleSave : handleRegister)}
    >
      <Toast />
      <Typography variant="sub-header-main">
        {isEditing ? t("edit-profile") : t("register-label")}
      </Typography>
      <Input
        label={t("username")}
        error={errors.username?.message}
        name="username"
        register={register}
        placeholder={t("username")}
      />

      <Input
        label={t("password")}
        error={errors.password?.message}
        name="password"
        register={register}
        placeholder={t("password")}
        type="password"
      />

      <Dropdown
        value={values?.role || ""}
        options={options}
        onChange={handleRoleChange}
        error={errors.role?.message}
        label={t("role")}
      />
      <DatePicker
        label={t("age")}
        max={new Date().toISOString().slice(0, 10)}
        value={values?.age}
        onChange={handleAgeChange}
        error={errors.age?.message}
      />
      <TabMenu
        selected={selectedOption}
        onChange={avatarOptionChange}
        name={t("avatar")}
        className="avatar-tab-menu"
        items={avatarOptions}
      />
      {selectedOption == "upload" ? (
        <ImagePicker
          value={values?.avatar}
          onChange={handleAvatarChange}
          name="avatar"
          label={t("select-avatar")}
        />
      ) : (
        <SelectAvatar value={values?.avatar} onChange={handleAvatarChange} />
      )}
      <Button
        type="submit"
        loading={isLoading || isUpdating}
        icon={isEditing ? IoIosSend : BsPerson}
        title={isEditing ? t("save") : t("register-label")}
        variant="primary"
      />
    </form>
  );
};

export default Register;
