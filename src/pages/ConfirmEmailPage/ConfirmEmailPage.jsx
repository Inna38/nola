import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastError } from "../../services/ToastError/ToastError";
import checked from "../../assets/icons/checked.svg";
import registrationCheck from "../../assets/icons/registrationCheck.svg";
import css from "./ConfirmEmailPage.module.css";
import { instance } from "../../services/axios";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const ConfirmEmailPage = () => {
  const { token } = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const verifyEmailUrl = (async () => {
      try {
        const { data } = await instance.post(
          `/auth/email/verify?token=${token}`
        );
        if (!token) {
          throw new Error();
        }
        setValidUrl(true);
      } catch (error) {
        ToastError(error?.response?.data?.suggested_action || error?.message);
        setValidUrl(false);
      } finally {
        setLoader(false);
      }
    })();
  }, []);

  return (
    <>
      {loader ? (
        <div className="loader">
          <LoaderSpiner />
        </div>
      ) : validUrl ? (
        <div className={css.container}>
          <img src={checked} alt="checked" />
          <div className={css.title_container}>
            <h1>Success!</h1>
            <p className={`${css.title} dark:text-white`}>
              Your email address has been verified.
            </p>
          </div>
          <Link to="/main/authorization" className={css.link}>
            Login
          </Link>
        </div>
      ) : (
        <div className={css.container}>
          <img src={registrationCheck} alt="registrationCheck" />
          <h1 className={`${css.title} dark:text-white`}>Error! Try again</h1>
          <Link to="/main/authorization/registration" className={css.link}>
            Registration
          </Link>
        </div>
      )}
    </>
  );
};

export default ConfirmEmailPage;
// c3f6c4b11b@emaily.pro
// 44444Aa@
// inna
// +

//46d0cf53c5@emaily.pro
// 44444Aa@
// inna-test

// 08221ba59a@emaily.pro
// 44444Aa@
// test2
// +

// f01040c6b7@emaily.pro
// 44444Aa@
// test3
