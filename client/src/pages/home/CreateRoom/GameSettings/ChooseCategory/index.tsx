import { FC, useState } from "react";
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
  [key: string]: string[];
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
  // const defaultWords = newCategories.reduce((acc, category) => {
  //   acc[category] = { easy: [], medium: [], hard: [] };
  //   return acc;
  // }, {} as AddedWords);
  const defaultWords: AddedWords[] = [];
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(false);
  const [created, setCreated] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(DifficaltyLevels[0]);
  const [words, setWords] = useState<AddedWords[]>(newWords ? JSON.parse(newWords) : defaultWords);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);

  const { mutate: createCategory, isLoading } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  const handleAddCategory = () => {
    if (!category || category.length > 20) return;
    setCategories((prev) => [...prev, category]);
    setSelectedCategory(category);
    setWords((prev) => [...prev, { [category]: { easy: [], medium: [], hard: [] } }]);
    toggleActive();
    setCreated(true);
  };

  // const handleAddWord = () => {
  //   if (!word || word.length > 20) return;
  //   setWords((prev) => ({
  //     ...prev,
  //     [selectedCategory]: { [selectedTab]: [...prev[selectedTab], word] },
  //   }));
  //   setWord("");
  // };

  // const handleDeleteWord = (data: { name: string; value: string }) => {
  //   setWords((prev) => ({
  //     ...prev,
  //     [selectedCategory]: {
  //       [selectedTab]: prev[selectedCategory][selectedTab].filter((item) => item !== data.value),
  //     },
  //   }));
  // };

  const handleAddWords = () => {
    const newCategoryWithWords = {
      ...JSON.parse(newWords ? newWords : "{}"),
      [category]: words,
    };
    createCategory(
      {
        category,
        words: JSON.stringify(newCategoryWithWords),
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
  };

  const handleTabChange = (tab: { name: string; value: string }) => {
    setSelectedTab(tab.value);
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const closeCreateCategory = () => {
    setWords(newWords ? JSON.parse(newWords) : defaultWords);
    setCategories((prev) => prev.slice(0, prev.length - 1));
    setCreated(false);
  };

  const items = DifficaltyLevels.map((item) => {
    return { label: item, value: item };
  });

  // const selectedCategoryValue = useMemo(() => {
  //   if (categories.length <= CATEGORIES.length) {
  //     return categories[0];
  //   }
  //   return categories[categories.length - 1];
  // }, [categories]);

  const TotalCategories = [...categories, ...newCategories];

  return (
    <>
      <ChipSelector
        disabled={categories.length > CATEGORIES.length}
        value={selectedCategory}
        name="category"
        chips={TotalCategories}
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
          {/* {created && (
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
                  chips={[]}
                  deletable
                  selectable={false}
                  onDeleteChip={handleDeleteWord}
                />
                <div className="input-icon">
                  <Input
                    className="add-word-input"
                    placeholder={`word ${words?.[selectedCategory][selectedTab]?.length + 1}`}
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
                  onClick={closeCreateCategory}
                  title="Cancel"
                  variant="secondary"
                  disabled={isLoading}
                />
              </div>
            </div>
          )} */}
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
