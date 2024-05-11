import { FC, useState, useEffect, useCallback } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Input from "../../../../../components/ui/Input";
import Button from "../../../../../components/ui/Button";
import { useMutation } from "react-query";
import { UserToUpdate } from "../../../../../interfaces/typing";
import { updateUser, deleteCategory } from "../../../../../services/user";
import { authStore } from "../../../../../store/authStore";
import TabMenu from "../../../../../components/ui/TabMenu";
import {
  CATEGORIES,
  DifficaltyLevels,
  NEW_CATEGORY_MAX_WORDS,
  NEW_CATEGORY_MIN_WORDS,
} from "../../../../../constants/game";
import ChipSelector, { ChipValue } from "../../../../../components/ui/ChipSelector";
import AIWords from "./AIWords";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import "./style.scss";

interface Words {
  [key: string]: string[];
}

interface ChooseCategoryProps {
  onCategorySelected: (data: { name: string; value: string }) => void;
}

export interface AddedWords {
  [key: string]: { [key: string]: string[] };
}

const createCategoryRoles = ["parent", "teacher"];

const ChooseCategory: FC<ChooseCategoryProps> = ({ onCategorySelected }) => {
  const { t } = useTranslation();
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
  const [selectedTab, setSelectedTab] = useState<string>(DifficaltyLevels[0].value);
  const [words, setWords] = useState<AddedWords>(newWords ? JSON.parse(newWords) : {});
  const [categories, setCategories] = useState<ChipValue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories?.[0]?.value);

  const { mutate: createCategory, isLoading } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  const { mutate: deleteCategoryMutation } = useMutation((categoryId: string) => {
    return deleteCategory(userId, categoryId);
  });

  useEffect(() => {
    let totalCategories: ChipValue[] = CATEGORIES.map((category) => {
      return {
        value: category,
        id: "",
      };
    });
    setCategories([...totalCategories, ...newCategories]);
    setSelectedCategory(totalCategories[0].value);
  }, []);

  const handleAddCategory = () => {
    if (!category || category.length > 20) return;
    setCategories((prev) => [
      ...prev,
      {
        value: category,
        id: category,
      },
    ]);
    setSelectedCategory(category);
    onCategorySelected({ name: "category", value: category });
    setSelectedUsersCategory(false);
    toggleActive();
    setCreated(true);
  };

  const handleAddWord = () => {
    if (!word || word.length > 20) return;

    let newWord = word.trim().toLowerCase();

    if (words[selectedCategory]?.[selectedTab]?.includes(newWord)) return;

    if (words[selectedCategory]?.[selectedTab]?.length >= NEW_CATEGORY_MAX_WORDS) {
      toast.warn(`The word limit of ${NEW_CATEGORY_MAX_WORDS} words has been exceeded`);

      return;
    }

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

  const handleDeleteWord = (data: ChipValue) => {
    setWords((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        [selectedTab]: prev[selectedCategory][selectedTab].filter((word) => word !== data.value),
      },
    }));
  };

  const handleAddWords = () => {
    for (let tab of DifficaltyLevels) {
      if (
        !words?.[selectedCategory]?.[tab.value] ||
        words[selectedCategory]?.[tab.value]?.length < NEW_CATEGORY_MIN_WORDS
      ) {
        toast.warn(t("add-more-words", { number: NEW_CATEGORY_MIN_WORDS }));
        return;
      }
    }
    createCategory(
      {
        category,
        words: JSON.stringify(words),
        userId,
      },
      {
        onSuccess: (data: any) => {
          setCreated(false);
          updateProfile({ words: data.words, categories: data.categories });
          setCategory("");
          toast.success(t("category-added-successfully"));
        },
        onError: () => {
          toggleActive();
          toast.error(t("could-not-add-category"));
        },
      }
    );
  };

  const handleCategoryChange = (data: { name: string; value: string; id: string }) => {
    setSelectedCategory(data.value);
    onCategorySelected(data);
    if (newCategories.find((category) => category.value === data.value)) {
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

  const handleWordsGenerated = (data: Words) => {
    if (!words[selectedCategory]) {
      setWords((prev) => ({
        ...prev,
        [selectedCategory]: data,
      }));
    } else {
      const updatedWordsForCategory = { ...words[selectedCategory] };

      for (const difficultyLevel in data) {
        if (data.hasOwnProperty(difficultyLevel)) {
          const existingWords = updatedWordsForCategory[difficultyLevel] || [];
          const newWords = data[difficultyLevel];

          const mergedWords = [...new Set([...existingWords, ...newWords])];

          if (mergedWords.length > NEW_CATEGORY_MAX_WORDS) {
            updatedWordsForCategory[difficultyLevel] = mergedWords.slice(0, NEW_CATEGORY_MAX_WORDS);
          } else {
            updatedWordsForCategory[difficultyLevel] = mergedWords;
          }
        }
      }

      setWords((prev) => ({
        ...prev,
        [selectedCategory]: updatedWordsForCategory,
      }));
    }
  };

  const handleDeleteCategory = (data: ChipValue) => {
    setCreated(false);
    deleteCategoryMutation(data.id, {
      onSuccess: () => {
        const filteredCategories = categories.filter((category) => category.value !== data.value);
        setCategories(filteredCategories);
        updateProfile({ categories: filteredCategories });
        toast.success(t("category-deleted-successfully"));
      },
      onError: () => {
        toast.error(t("could-not-delete-category"));
      },
    });
  };

  const items = DifficaltyLevels.map((item) => {
    return { label: t(`difficalty.${item.value}`), value: item.value };
  });

  const categoryWords = useCallback(() => {
    return words?.[selectedCategory]?.[selectedTab].map((word: string) => {
      return {
        id: word,
        value: word,
      };
    });
  }, [selectedCategory, selectedTab, words]);

  return (
    <>
      <ChipSelector
        disabled={categories.length - newCategories.length > CATEGORIES.length}
        value={selectedCategory}
        name="category"
        chips={categories}
        onChange={handleCategoryChange}
        onDeleteChip={handleDeleteCategory}
      />
      {createCategoryRoles.includes(role) && (
        <div className="create-category-container">
          {!active && !created && <AddIcon onClick={toggleActive} />}
          {active && !created && (
            <div className="category-field-container">
              <Input
                value={category}
                name="category"
                placeholder={t("Category")}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="category-buttons">
                <Button onClick={handleAddCategory} title={t("create")} />
                <Button onClick={toggleActive} title={t("cancel")} variant="secondary" />
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
                  chips={categoryWords() || []}
                  deletable
                  selectable={false}
                  onDeleteChip={handleDeleteWord}
                />
                <AIWords category={selectedCategory} onWordsGenerated={handleWordsGenerated} />
                <div className="input-icon">
                  <Input
                    className="add-word-input"
                    placeholder={`${t("word")} ${
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
                <Button onClick={handleAddWords} title={t("save")} loading={isLoading} />
                <Button
                  onClick={cancelCreateCategory}
                  title={t("cancel")}
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
