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
import ChipSelector from "../../../../../components/ui/ChipSelector";

interface CreateCategoryProps {
  onCreateCategory: (e: any) => void;
  onCancel: () => void;
}

export interface AddedWords {
  [key: string]: string[];
}

const defaultWords = DifficaltyLevels.map((item) => ({ [item]: [] })).reduce((acc, item) => ({
  ...acc,
  ...item,
}));

const CreateCategory: FC<CreateCategoryProps> = ({ onCreateCategory, onCancel }) => {
  const { userId, updateProfile, words: newWords } = authStore((state) => state);
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(false);
  const [created, setCreated] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(DifficaltyLevels[0]);
  const [words, setWords] = useState<AddedWords>(newWords ? JSON.parse(newWords) : defaultWords);

  const { mutate: createCategory, isLoading } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  const handleAddCategory = () => {
    if (!category || category.length > 20) return;
    onCreateCategory(category);
    toggleActive();
    setCreated(true);
  };

  const handleAddWord = () => {
    if (!word || word.length > 20) return;
    setWords((prev) => ({
      ...prev,
      [selectedTab]: [...prev[selectedTab], word],
    }));
    setWord("");
  };

  const handleAddWords = () => {
    createCategory(
      { category, words: JSON.stringify(words), userId },
      {
        onSuccess: (data: any) => {
          setCreated(false);
          updateProfile({ words: data.words, categories: data.categories });
        },
        onError: () => {
          toggleActive();
        },
      }
    );
  };

  const handleTabChange = (tab: { name: string; value: string }) => {
    setSelectedTab(tab.value);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const closeCreateCategory = () => {
    setWords(newWords ? JSON.parse(newWords) : defaultWords);
    setCreated(false);
    onCancel();
  };

  const items = DifficaltyLevels.map((item) => {
    return { label: item, value: item };
  });

  return (
    <div className="create-category-container">
      {!active && !created && <AddIcon onClick={toggleActive} />}
      {active && !created && (
        <div className="category-field-container">
          <Input
            value={category}
            name="category"
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
          />
          <div className="category-buttons">
            <Button onClick={handleAddCategory} title="Create" />
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
                placeholder={`word ${words[selectedTab].length + 1}`}
                onChange={(e) => setWord(e.target.value)}
                value={word}
                name="word"
              />
              <AddIcon onClick={handleAddWord} />
            </div>
          </div>
          <div className="add-words-buttons">
            <Button onClick={handleAddWords} title="Create" loading={isLoading} />
            <Button
              onClick={closeCreateCategory}
              title="Cancel"
              variant="secondary"
              disabled={isLoading}
            />
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
