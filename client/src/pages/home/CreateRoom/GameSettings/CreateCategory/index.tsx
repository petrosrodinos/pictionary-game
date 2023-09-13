import { FC, useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "../../../../../components/ui/Input";
import "./style.scss";
import Button from "../../../../../components/ui/Button";
import { useMutation } from "react-query";
import { UserToUpdate } from "../../../../../interfaces/typing";
import { updateUser } from "../../../../../services/user";
import { authStore } from "../../../../../store/authStore";

interface CreateCategoryProps {
  onCreateCategory: (e: any) => void;
}

const CreateCategory: FC<CreateCategoryProps> = ({ onCreateCategory }) => {
  const { userId } = authStore((state) => state);
  const [active, setActive] = useState(false);
  const [category, setCategory] = useState("");

  //   const { mutate: createCategory, isLoading } = useMutation(
  //     (user: UserToUpdate) => {
  //       return updateUser(user);
  //     }
  //   );

  const toggleActive = () => {
    setActive(!active);
  };

  const handleChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handleCreate = () => {
    if (!category || category.length > 20) return;
    onCreateCategory(category);
    setCategory("");
    toggleActive();
    // createCategory({ category,userId },{
    //     onSuccess: () => {
    //         toggleActive();
    //         onCreateCategory(category);
    //     },
    //     onError: () => {
    //         toggleActive();
    //     }
    // });
  };

  return (
    <div className="create-category-container">
      {!active && (
        <span onClick={toggleActive} className="add-category">
          <AiOutlinePlus />
        </span>
      )}
      {active && (
        <div className="category-field-container">
          <Input value={category} name="category" placeholder="Category" onChange={handleChange} />
          <div className="category-buttons">
            <Button onClick={handleCreate} title="Create" />
            <Button onClick={toggleActive} title="Cancel" variant="secondary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCategory;
