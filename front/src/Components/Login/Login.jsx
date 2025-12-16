import { useForm } from "react-hook-form";
import { loginSchema } from "../../schema/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppButton from "../../shared/AppButton";
import { UserContext } from "../../Context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function Login() {
  const navigate = useNavigate();
  const { setUserLogin } = useContext(UserContext);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = form;

  async function handleLogin(values) {
    return await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/signin`,
      values
    );
  }

  const { mutate, isError, isPending } = useMutation({
    mutationFn: handleLogin,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.response.token);
      setUserLogin(data.data.response.token);
      navigate("/");
      queryClient.invalidateQueries("getAllPosts");
      queryClient.invalidateQueries("getPostDetails");
    },
    onError: () => {
      toast.error("Invalid credentials", {
        theme: "dark",
      });
    },
  });

  return (
    <>
      <Helmet>
        <title>SocialApp | Login</title>
      </Helmet>

      <section className="p-12">
        <div className="max-w-xl mx-auto p-8 dark:bg-gray-800">
          <h1 className="text-center p-6 text-4xl">Login</h1>
          <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4">
            {isError && (
              <p className="text-red-500 font-semibold text-2xl text-center my-2">
                {isError}
              </p>
            )}

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

            <AppButton isLoading={isPending}>Login</AppButton>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <Link
                to={"/register"}
                href="#"
                class="text-blue-700 hover:underline dark:text-blue-500"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
