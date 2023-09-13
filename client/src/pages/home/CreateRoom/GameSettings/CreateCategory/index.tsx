import { FC, useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "../../../../../components/ui/Input";
import "./style.scss";
import Button from "../../../../../components/ui/Button";
import { useMutation } from "react-query";
import { UserToUpdate } from "../../../../../interfaces/typing";
import { updateUser } from "../../../../../services/user";
import { authStore } from "../../../../../store/authStore";
import TabMenu from "../../../../../components/ui/TabMenu";
import { DifficaltyLevels } from "../../../../../constants/game";
import Typography from "../../../../../components/ui/Typography";
import ChipSelector from "../../../../../components/ui/ChipSelector";

interface CreateCategoryProps {
  onCreateCategory: (e: any) => void;
}

interface Words {
  [key: string]: string[];
}

const CreateCategory: FC<CreateCategoryProps> = ({ onCreateCategory }) => {
  const { userId } = authStore((state) => state);
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const [created, setCreated] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(DifficaltyLevels[0]);
  const [words, setWords] = useState<Words>(
    DifficaltyLevels.map((item) => ({ [item]: [] })).reduce((acc, item) => ({ ...acc, ...item }))
  );

  //   const { mutate: createCategory, isLoading } = useMutation(
  //     (user: UserToUpdate) => {
  //       return updateUser(user);
  //     }
  //   );

  const toggleActive = () => {
    setActive(!active);
  };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleCreate = () => {
    if (!value || value.length > 20) return;
    onCreateCategory(value);
    setValue("");
    toggleActive();
    setCreated(true);
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

  const handleTabChange = (tab: { name: string; value: string }) => {
    setSelectedTab(tab.value);
  };

  const handleAddWord = () => {
    if (!value || value.length > 20) return;
    setWords((prev) => ({
      ...prev,
      [selectedTab]: [...prev[selectedTab], value],
    }));
    setValue("");
  };

  const items = DifficaltyLevels.map((item) => {
    return { label: item, value: item };
  });

  return (
    <div className="create-category-container">
      {!active && !created && <AddIcon onClick={toggleActive} />}
      {active && !created && (
        <div className="category-field-container">
          <Input value={value} name="category" placeholder="Category" onChange={handleChange} />
          <div className="category-buttons">
            <Button onClick={handleCreate} title="Create" />
            <Button onClick={toggleActive} title="Cancel" variant="secondary" />
          </div>
        </div>
      )}
      {created && (
        <div className="add-word-container">
          <TabMenu items={items} name="words" selected={selectedTab} onChange={handleTabChange} />
          <div className="add-word-field-container">
            <ChipSelector
              style={{ justifyContent: "unset" }}
              translate={false}
              chips={words[selectedTab]}
            />
            <div className="input-icon">
              <Input
                className="add-word-input"
                placeholder={`word-${words[selectedTab].length + 1}`}
                onChange={handleChange}
                value={value}
                name="word"
              />
              <AddIcon onClick={handleAddWord} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AddIcon: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <span onClick={onClick} className="add-category">
      <AiOutlinePlus />
    </span>
  );
};

export default CreateCategory;
