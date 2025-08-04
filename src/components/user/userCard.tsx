interface UserCardProps {
  photoUrl: string;
  name: string;
  email: string;
  phone: string;
  isNew?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}


export default function UserCard({
  photoUrl,
  name,
  email,
  phone,
  isNew,
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <div className="relative p-4 transition bg-white rounded-lg shadow hover:shadow-md">
      {isNew && (
        <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full top-2 right-2">
          New
        </span>
      )}
      <div className="flex items-center gap-4">
        <img
          src={photoUrl}
          alt={name}
          className="object-cover w-16 h-16 border rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{phone}</p>
        </div>
      </div>

     <div className="flex gap-2 mt-4">
  <button
    onClick={onEdit}
    className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
  >
    Edit
  </button>
  <button
    onClick={onDelete}
    className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
  >
    Delete
  </button>
</div>

    </div>
  );
}
