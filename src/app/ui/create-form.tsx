"use client";

export default function CreateForm() {
  const handleKeyUp = ():
    | import("react").KeyboardEventHandler<HTMLInputElement>
    | void => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    if (passwordInput && confirmPasswordInput) {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      if (password === confirmPassword) {
        confirmPasswordInput.style.borderColor = "green";
        passwordInput.style.borderColor = "green";
        confirmPasswordInput.style.borderWidth = "3px";
        passwordInput.style.borderWidth = "3px";
      } else {
        confirmPasswordInput.style.borderColor = "red";
        passwordInput.style.borderColor = "red";
        confirmPasswordInput.style.borderWidth = "3px";
        passwordInput.style.borderWidth = "3px";
      }
    }
  };

  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 login-form text-black">
        <h1 className={`mb-3 text-2xl`}>Create an Account with Us!</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                onKeyUp={handleKeyUp}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                minLength={6}
                onKeyUp={handleKeyUp}
              />
            </div>
          </div>
        </div>
        <button className="mt-4 w-full create-account-button p-3">
          Create
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}
