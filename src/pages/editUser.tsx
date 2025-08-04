import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { validatePhone } from "@/service/api";

export default function EditUser() {
  const router = useRouter();
  const { email } = router.query;

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [validationStatus, setValidationStatus] = useState({
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (email) {
      const storedUsers = localStorage.getItem("customUsers");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        const existingUser = parsedUsers.find((u: any) => u.email === email);
        if (existingUser) {
          setFormData({
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            phone: existingUser.phone,
          });
          setImagePreview(existingUser.image || null);
        }
      }
    }
  }, [email]);

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

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const { firstName, lastName, email, phone } = formData;

      if (!firstName || !lastName || !email || !phone) {
        alert("Please fill in all fields.");
        setIsSubmitting(false);
        return;
      }

      const phoneResult = await validatePhone(phone);
      const isPhoneValid = phoneResult?.valid;

      setValidationStatus((prev) => ({
        ...prev,
        phone: isPhoneValid ? "Valid" : "Invalid",
      }));

      if (!isPhoneValid) {
        alert("Phone number is not valid.");
        setIsSubmitting(false);
        return;
      }

      const updatedUser = {
        firstName,
        lastName,
        email,
        phone,
        image: imagePreview,
        isNew: true,
      };

      const storedUsers = localStorage.getItem("customUsers");
      let updatedUsers = [];
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        updatedUsers = parsedUsers.map((u: any) =>
          u.email === email ? updatedUser : u
        );
        localStorage.setItem("customUsers", JSON.stringify(updatedUsers));
      }

      alert("User updated successfully!");
      router.push("/mainPage");
    } catch (error) {
      console.error("Failed to update user", error);
      alert("Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit User</h1>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={formData.email}
            disabled
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
            onClick={handleUpdate}
            disabled={isSubmitting}
            className={`px-6 py-2 font-semibold rounded-lg transition-colors
            bg-[#092c57] text-white hover:bg-[#0b3a73]
            disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400`}
          >
            {isSubmitting ? "Updating..." : "Update User"}
          </button>
        </div>
      </div>
    </main>
  );
}
