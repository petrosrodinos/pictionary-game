import { FC, useState, useMemo, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "../../../../../components/ui/Input";
import Button from "../../../../../components/ui/Button";
import { useMutation } from "react-query";
import { UserToUpdate } from "../../../../../interfaces/typing";
import { updateUser } from "../../../../../services/user";
import { authStore } from "../../../../../store/authStore";
import TabMenu from "../../../../../components/ui/TabMenu";
import { CATEGORIES, DifficaltyLevels } from "../../../../../constants/game";
import ChipSelector from "../../../../../components/ui/ChipSelector";
import "./style.scss";

interface ChooseCategoryProps {
  onCategorySelected: (data: { name: string; value: string }) => void;
}

export interface AddedWords {
  [key: string]: { [key: string]: string[] };
}

const createCategoryRoles = ["parent", "teacher"];

const ChooseCategory: FC<ChooseCategoryProps> = ({ onCategorySelected }) => {
  const {
    userId,
    updateProfile,
    words: newWords,
    role,
    categories: newCategories,
  } = authStore((state) => state);
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(false);
  const [created, setCreated] = useState(false);
  const [selectedUsersCategory, setSelectedUsersCategory] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(DifficaltyLevels[0]);
  const [words, setWords] = useState<AddedWords>(newWords ? JSON.parse(newWords) : {});
  const [categories, setCategories] = useState<string[]>([...CATEGORIES, ...newCategories]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  const { mutate: createCategory, isLoading } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  // useEffect(() => {
  //   console.log("categories", categories);
  // }, [categories]);

  const handleAddCategory = () => {
    if (!category || category.length > 20) return;
    setCategories((prev) => [...prev, category]);
    setSelectedCategory(category);
    setSelectedUsersCategory(false);
    toggleActive();
    setCreated(true);
  };

  const handleAddWord = () => {
    if (!word || word.length > 20) return;
    let newWord = word.trim().toLowerCase();
    if (words[selectedCategory]?.[selectedTab]?.includes(newWord)) return;
    if (!words[selectedCategory]) {
      setWords((prev) => ({
        ...prev,
        [selectedCategory]: { [selectedTab]: [newWord] },
      }));
    } else if (!words[selectedCategory][selectedTab]) {
      setWords((prev) => ({
        ...prev,
        [selectedCategory]: {
          ...prev[selectedCategory],
          [selectedTab]: [newWord],
        },
      }));
    } else {
      setWords({
        ...words,
        [selectedCategory]: {
          ...words[selectedCategory],
          [selectedTab]: [...words[selectedCategory][selectedTab], newWord],
        },
      });
    }
    setWord("");
  };

  const handleDeleteWord = (data: { name: string; value: string }) => {
    setWords((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [selectedTab]: prev[selectedCategory][selectedTab].filter((word) => word !== data.value),
      },
    }));
  };

  const handleAddWords = () => {
    // for(let tab in DifficaltyLevels){
    //   if(words[selectedCategory][tab].length<8){
    //     console.log("add more words")
    //   }
    // }
    createCategory(
      {
        category,
        words: JSON.stringify(words),
        userId,
      },
      {
        onSuccess: (data: any) => {
          setCreated(false);
          // updateProfile({ words: data.words, categories: data.categories });
        },
        onError: () => {
          toggleActive();
        },
      }
    );
  };

  const handleCategoryChange = (data: { name: string; value: string }) => {
    setSelectedCategory(data.value);
    onCategorySelected(data);
    if (newCategories.includes(data.value)) {
      setCreated(true);
      setSelectedUsersCategory(true);
    } else {
      setCreated(false);
      setSelectedUsersCategory(false);
    }
  };

  const handleTabChange = (tab: { name: string; value: string }) => {
    setSelectedTab(tab.value);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const cancelCreateCategory = () => {
    setWords(newWords ? JSON.parse(newWords) : {});
    if (!selectedUsersCategory) {
      setCategories((prev) => prev.slice(0, prev.length - 1));
    }
    setCreated(false);
  };

  const items = DifficaltyLevels.map((item) => {
    return { label: item, value: item };
  });

  return (
    <>
      <ChipSelector
        disabled={categories.length - newCategories.length > CATEGORIES.length}
        value={selectedCategory}
        name="category"
        chips={categories}
        onChange={handleCategoryChange}
      />
      {createCategoryRoles.includes(role) && (
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
              <TabMenu
                items={items}
                name="words"
                selected={selectedTab}
                onChange={handleTabChange}
              />
              <div className="add-word-field-container">
                <ChipSelector
                  style={{ justifyContent: "unset" }}
                  translate={false}
                  chips={words?.[selectedCategory]?.[selectedTab] || []}
                  deletable
                  selectable={false}
                  onDeleteChip={handleDeleteWord}
                />
                <div className="input-icon">
                  <Input
                    className="add-word-input"
                    placeholder={`word ${
                      words?.[selectedCategory]?.[selectedTab]?.length + 1 || 1
                    }`}
                    onChange={(e) => setWord(e.target.value)}
                    value={word}
                    name="word"
                  />
                  <AddIcon onClick={handleAddWord} />
                </div>
              </div>
              <div className="add-words-buttons">
                <Button onClick={handleAddWords} title="Add" loading={isLoading} />
                <Button
                  onClick={cancelCreateCategory}
                  title="Cancel"
                  variant="secondary"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const AddIcon: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <span onClick={onClick} className="add-category">
      <AiOutlinePlus />
    </span>
  );
};

export default ChooseCategory;
