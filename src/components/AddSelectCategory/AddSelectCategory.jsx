import PropTypes from "prop-types";
import { useEffect } from "react";
import css from "./AddSelectCategory.module.css";
import Select from "react-select";
import category from "../../assets/json/category.json";
import subcategory from "../../assets/json/subcategory.json";
import { useState } from "react";

import { useCustomContext } from "../../services/Context/Context";
import { nanoid } from "nanoid";


export const AddSelectCategory = ({ setPost, post }) => {
  const { theme } = useCustomContext();

  const [categorySelect, setCategorySelect] = useState([]);
  const [subcategorySelect, setSubcategorySelect] = useState([]);
  const [disabledSelect, setDisabledSelect] = useState(true);


  useEffect(() => {
    setCategorySelect(category);
  }, []);


  useEffect(() => {
    if (post?.category?.name) {
      const selectedCategory = category.find(
        (cat) => cat.label === post.category.name
      );
      if (selectedCategory) {
        const filteredSubcategories = subcategory.filter(
          (sub) => sub.categoryId === selectedCategory.id
        );
        setSubcategorySelect(filteredSubcategories);
        setDisabledSelect(false);
      }
    }
  }, [post?.category?.name]);

  const handleSelectCategoryPost = (categoryOption) => {
    const filteredSubcategories = subcategory.filter(
      ({ categoryId }) => categoryId === categoryOption.id
    );

    setPost((prev) => ({
      ...prev,
      category: {
        index: nanoid(),
        name: categoryOption.label,
        title: categoryOption.label,
      },
      subcategory: { name: "" }, 
    }));

    setSubcategorySelect(filteredSubcategories);
    setDisabledSelect(false);

    localStorage.setItem("filterCategory", JSON.stringify(filteredSubcategories));
  };

  const handleSelectSubcategoryPost = (subcategoryOption) => {
    setPost((prev) => ({
      ...prev,
      subcategory: {
        name: subcategoryOption.label,
      },
    }));
  };

  const themeSelect = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "transparent",
      primary: "#ECCD43",
    },
  });

  const selectedCategoryOption = categorySelect.find(
    (cat) => cat.label === post?.category?.name
  ) || null;

  const selectedSubcategoryOption = subcategorySelect.find(
    (sub) => sub.label === post?.subcategory?.name
  ) || (post?.subcategory?.name
    ? { label: post.subcategory.name, value: nanoid() }
      : null);
  

  return (
    <>
           <label className={`${css.post_description} dark:text-white`}>
        Category*
        {theme === "dark" ? (
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                padding: "8px 24px",
                backgroundColor: "rgb(30 28 28)",
              }),
              menuList: (styles) => ({
                ...styles,
                backgroundColor: "rgb(137 132 132)",
                color: "white",
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectCategoryPost}
            value={selectedCategoryOption}
            options={categorySelect}
          />
        ) : (
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                padding: "8px 24px",
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectCategoryPost}
            value={selectedCategoryOption}
            options={categorySelect}
          />
        )}
      </label>
      <label className={`${css.post_description} dark:text-white`}>
        Subcategory*
        {theme === "dark" ? (
          <Select
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                padding: "8px 24px",
                backgroundColor: !state.isDisabled ? "" : "#363232",
              }),
              menuList: (styles) => ({
                ...styles,
                backgroundColor: "rgb(137 132 132)",
                color: "white",
              }),
            }}
            theme={themeSelect}
            isDisabled={disabledSelect}
            value={selectedSubcategoryOption}
            options={subcategorySelect}
            onChange={handleSelectSubcategoryPost}
          />
        ) : (
          <Select
            styles={{
              control: (baseStyles, state) => ({
                padding: "8px 24px",
                backgroundColor: !state.isDisabled ? "" : "#e4e1e1",
                ...baseStyles,
              }),
            }}
            theme={themeSelect}
            isDisabled={disabledSelect}
            value={selectedSubcategoryOption}
            options={subcategorySelect}
            onChange={handleSelectSubcategoryPost}
          />
        )}
      </label>
    </>
  );
};

AddSelectCategory.propTypes = {
  setPost: PropTypes.func,
  post: PropTypes.object,
};
