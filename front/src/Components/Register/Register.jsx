import { useForm } from "react-hook-form";
import { registerSchema } from "../../schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppButton from "../../shared/AppButton";
import { Helmet } from "react-helmet";

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = form;

  async function handleRegister(values) {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/signup`,
        values
      );
      if (data.response.message === "success") {
        setApiError(null);
        navigate("/login");
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      setApiError(error.response.data.message);
    }
  }

  return (
    <>
      <Helmet>
        <title>SocialApp | Register</title>
      </Helmet>

      <section className="p-12">
        <div className="max-w-xl mx-auto p-8 dark:bg-gray-800">
          <h1 className="text-center p-6 text-4xl">Register</h1>
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-4"
          >
            {apiError && (
              <p className="text-red-500 font-semibold text-2xl text-center my-2">
                {apiError}
              </p>
            )}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Name:
              </label>
              <input
                type="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="omar mohamed"
                {...register("name")}
              />
              {errors.name && touchedFields.name && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@gmail.com"
                {...register("email")}
              />
              {errors.email && touchedFields.email && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password:
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*******"
                {...register("password")}
              />
              {errors.password && touchedFields.password && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="rePassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your rePassword:
              </label>
              <input
                type="password"
                id="rePassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="*******"
                {...register("rePassword")}
              />
              {errors.rePassword && touchedFields.rePassword && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.rePassword.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="dateOfBirth"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Bithday:
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="01-01-2000"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && touchedFields.dateOfBirth && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  id="male"
                  type="radio"
                  {...register("gender")}
                  value="male"
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="male"
                  className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Male
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="female"
                  type="radio"
                  {...register("gender")}
                  value="female"
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="female"
                  className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Female
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 font-semibold text-center my-2">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <AppButton isLoading={isSubmitting}>Register</AppButton>
          </form>
        </div>
      </section>
    </>
  );
}
