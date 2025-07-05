import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAccountApi, postPostApi } from "../../services/https/https";
import { ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";
import css from "./AddPostPage.module.css";
import { ToastError } from "../../services/ToastError/ToastError";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { Modal } from "../../components/Modal/Modal";
import { CreatePost } from "../../components/CreatePost/CreatePost";

const AddPostPage = ({ postEdit, setPostEdit, draftsEdit, setDraftsEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [formConfig, setFormConfig] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [sendPost, setSendPost] = useState({});
  const [profile, setProfile] = useState({});
  const [links, setLinks] = useState(() => {
    return (
      // JSON.parse(localStorage.getItem("previewPost"))?.links ||
      location?.state?.links ?? [{ id: nanoid(), href: "", action: "" }]
    );
  });
  const [data, setData] = useState(() => {
    return (
      // JSON.parse(localStorage.getItem("previewPost")) ??
      location.state ?? {
        // draftsEdit ?? // postEdit ??
        description: "",
        title: "",
        category: {
          index: "",
          name: "",
          title: "",
          // subcategory: [
          //   {
          //     name: ""
          //   }
          // ],
        },
        subcategory: {
          name: "",
        },
        callToAction: "" || "Read more",
        callToActionLinks: "",
        banners: [],
        status: "pending",
      }
    );
  });

  // useEffect(() => {
  //   localStorage.setItem("previewPost", JSON.stringify(post));
  // }, [data]);

    useEffect(() => {
   (   async () => {
     const {data} = await getAccountApi()

     setProfile(data.profile_picture?.replace("image/upload/", ""))
    })()
  }, []);

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const cancelAddPost = () => {
    // localStorage.removeItem("previewPost");
    navigate("/main");
    setIsModal((prev) => !prev);
  };

  const createPostDrafts = async () => {
    try {
      // const data = await postDraftsPost(post)
      setIsModal((prev) => !prev);
      const dataRes = await postPostApi({ ...data, status: "draft" });
      console.log("drafts", dataRes);
    
      // localStorage.setItem("backend", JSON.stringify(post));

      // localStorage.removeItem("previewPost");
      // localStorage.removeItem("filterCategory");
      navigate("/main");

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data.title !== "" && data.category !== "" && data.subcategory !== "") {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [data.category, data.subcategory, data.title]);

  const handleBack = () => {
    setIsModal((prev) => !prev);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    console.log("post", data);
    try {
      const data = await postPostApi({ ...data, status: "pending" });

      setSendPost(data);
      setPostSuccessfullyAdded(true);
      // localStorage.removeItem("previewPost");
      localStorage.removeItem("filterCategory");

      setTimeout(() => {
        navigate("/main");
      }, 3000);
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const handlePreview = () => {
    console.log("handlePreview", data);
    navigate("/main/addPost/previewAdvertisemet", {
      state: {
        data,
        profile,
        from: location.pathname,
      },
    });
    // navigate("/main/addPost/previewAdvertisemet", { state: post });
  };

  return (
    <div>
      {!postSuccessfullyAdded && (
        <>
          <ToastContainer />
          {/* {formConfig && (
            <HandleFormConfig
              message={"Sucsessfull add a new advertisement"}
              navigatePage={"/main/accountAdverticer"}
            />
          )} */}
          <div className={css.top_container} onClick={handleBack}>
            <GoBackButton
              to=""
              imgWidth="50px"
              imgHeight="50px"
              imgAlt="Go back"
            />
            <p className={`${css.title_back} dark:text-white`}>
              New advertisement
            </p>
          </div>

          <form onSubmit={handleSubmitPost}>
            <CreatePost
              setPost={setData}
              post={data}
              links={links}
              setLinks={setLinks}
            />

            <div className={css.btn_container}>
              {/* <NavLink to="/main/addPost/previewAdvertisemet"> */}
              <button
                type="button"
                className={css.btn_preview_container}
                onClick={handlePreview}
              >
                <span className={`${css.btn_preview} dark:text-white`}>
                  Preview
                </span>
              </button>
              {/* </NavLink> */}

              <button
                type="submit"
                className={`${css.btn} ${
                  validForm ? css.btn_active : css.btn_disabled
                }`}
                disabled={validForm ? false : true}
              >
                <span className={css.btn_back_active}>Publish</span>
              </button>
            </div>
          </form>
        </>
      )}
      {isModal && (
        <Modal
          handleToggleModal={handleToggleModal}
          confirm={createPostDrafts}
          cancel={cancelAddPost}
          title="Add post to draft?"
          description="You can come back to edit later."
        >
          <h2 className={css.modal_title}>Add post to draft?</h2>
          <p className={css.modal_descr}>You can come back to edit later.</p>
        </Modal>
      )}
      {postSuccessfullyAdded && (
        <MessagePostOnModeration data={sendPost}>
          Advertisement is under moderation. <br />
          It will take about 15 minutes.
        </MessagePostOnModeration>
      )}
    </div>
  );
};

export default AddPostPage;

AddPostPage.propTypes = {
  postEdit: PropTypes.object,
  setPostEdit: PropTypes.func,
  draftsEdit: PropTypes.object,
  setDraftsEdit: PropTypes.func,
};
