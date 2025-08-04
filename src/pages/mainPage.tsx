import { useState, useEffect } from "react";
import UserCard from "@/components/user/userCard";
import SearchBar from "@/components/user/searchBar";
import Pagination from "@/components/user/pagination";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "@/redux/userSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { addUser, removeUser } from "@/redux/userSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, total, loading } = useSelector(
    (state: RootState) => state.user
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    dispatch(getUsers({ limit: 100, skip: 0 }));

    const storedUsers = localStorage.getItem("customUsers");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);

      const existingEmails = new Set(users.map((u) => u.email));

      parsedUsers.forEach((user: any) => {
        if (!existingEmails.has(user.email)) {
          dispatch(addUser(user));
        }
      });
    }
  }, [dispatch]);

  const sortedUsers = [...users].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleEdit = (user: any) => {
    router.push(`/editUser?email=${user.email}`);
  };

  const handleDelete = (user: any) => {
    if (confirm(`Yakin ingin hapus user ${user.firstName}?`)) {
      dispatch(removeUser(user));

      const storedUsers = localStorage.getItem("customUsers");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        const updatedUsers = parsedUsers.filter(
          (u: any) => u.email !== user.email
        );
        localStorage.setItem("customUsers", JSON.stringify(updatedUsers));
      }

      alert("User berhasil dihapus!");
    }
  };

  return (
    <main className="max-w-5xl px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Manager</h1>
        <button
          onClick={() => router.push("/addUser")}
          className="flex items-center space-x-2 bg-[#092c57] text-white px-4 py-2 rounded-md hover:bg-[#0b3a73] transition"
        >
          <FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#092c57]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedUsers.map((user, index) => (
              <UserCard
                key={index}
                photoUrl={
                  user.image || `https://i.pravatar.cc/150?img=${index}`
                }
                name={`${user.firstName} ${user.lastName}`}
                email={user.email}
                phone={user.phone}
                isNew={user.isNew}
                onEdit={() => handleEdit(user)}
                onDelete={() => handleDelete(user)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </main>
  );
}
