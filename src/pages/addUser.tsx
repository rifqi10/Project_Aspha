import { useState } from "react";
import { useRouter } from "next/router";
import { validateEmail, validatePhone } from "@/service/api";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/userSlice";

export default function AddUser() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [validationStatus, setValidationStatus] = useState<{
    email: string;
    phone: string;
  }>({
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const dispatch = useDispatch();

  const validateAndAdd = async () => {
    setIsSubmitting(true);
    try {
      const { firstName, lastName, email, phone } = formData;

      const errors = {
        email: "",
        phone: "",
      };

      if (!firstName || !lastName || !email || !phone || !image) {
        alert("Please fill in all fields including image.");
        setIsSubmitting(false);
        return;
      }

      const emailResult = await validateEmail(email);
      const isEmailValid =
        emailResult?.is_valid_format?.value && emailResult?.is_mx_found?.value;

      errors.email = isEmailValid ? "Valid" : "Invalid";

      const phoneResult = await validatePhone(phone);
      const isPhoneValid = phoneResult?.valid;
      errors.phone = isPhoneValid ? "Valid" : "Invalid";

      setValidationStatus(errors);

      if (!isEmailValid || !isPhoneValid) {
        setIsSubmitting(false);
        return;
      }

      dispatch(
        addUser({
          firstName,
          lastName,
          email,
          phone,
          image: imagePreview || "",
        })
      );

      alert("User added successfully!");

      const newUser = {
        firstName,
        lastName,
        email,
        phone,
        image: imagePreview || "",
        isNew: true,
      };

      const existing = localStorage.getItem("customUsers");
      const savedUsers = existing ? JSON.parse(existing) : [];

      savedUsers.unshift(newUser);

      localStorage.setItem("customUsers", JSON.stringify(savedUsers));

      dispatch(addUser(newUser));

      router.push("/mainPage");
    } catch (error) {
      console.error("Validation failed", error);
      alert("Validation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Add New User</h1>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
          {validationStatus.email && (
            <p
              className={`mt-1 text-sm ${
                validationStatus.email === "Valid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Email {validationStatus.email}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={handleChange}
          />
          {validationStatus.phone && (
            <p
              className={`mt-1 text-sm ${
                validationStatus.phone === "Valid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              Phone {validationStatus.phone}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Upload Photo
          </label>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative w-32 h-32">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full border border-gray-300 rounded-full shadow-md"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-gray-400 bg-gray-100 border border-gray-300 border-dashed rounded-full">
                  No Image
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="transition duration-200 file-input file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-400 file:text-white hover:file:bg-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleBack}
            className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Kembali
          </button>

          <button
            onClick={validateAndAdd}
            disabled={
              isSubmitting ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.phone ||
              !image
            }
            className={`px-6 py-2 flex items-center gap-2 font-semibold rounded-lg transition-colors
            bg-[#092c57] text-white hover:bg-[#0b3a73]
            disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Validating...
              </>
            ) : (
              "Validate & Add"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
