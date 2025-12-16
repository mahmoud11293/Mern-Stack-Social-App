import React from "react";
import { useForm } from "react-hook-form";
import AppButton from "../../shared/AppButton";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  async function changePassword(value) {
    return await axios.put(
      `${import.meta.env.VITE_BASE_URL}/user/change-password`,
      value,
      {
        headers: {
          token: `testPrefix ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset();
      toast.success("password changed successfully", {
        theme: "dark",
      });
    },
    onError: () => {
      toast.error("password change failed", {
        theme: "dark",
      });
    },
  });

  return (
    <form class="w-1/2 mx-auto" onSubmit={handleSubmit(mutate)}>
      <div class="mb-6">
        <label
          htmlFor="password"
          class="block mb-2.5 text-sm font-medium text-heading"
        >
          Current Password
        </label>
        <input
          type="password"
          id="old-password"
          class="bg-[#1E2939] border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-2xl"
          placeholder="•••••••••"
          {...register("oldPassword")}
        />
      </div>
      <div class="mb-6">
        <label
          htmlFor="confirm_password"
          class="block mb-2.5 text-sm font-medium text-heading"
        >
          New password
        </label>
        <input
          type="password"
          id="new-password"
          class="bg-[#1E2939] border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-2xl"
          placeholder="•••••••••"
          {...register("newPassword")}
        />
      </div>

      <AppButton type="submit" isLoading={isPending}>
        Change Password
      </AppButton>
    </form>
  );
}
