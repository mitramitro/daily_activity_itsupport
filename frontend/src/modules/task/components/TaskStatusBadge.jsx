export default function TaskStatusBadge({ status }) {
  const getClass = () => {
    if (status === "pending") return "bg-gray-100 text-gray-600";
    if (status === "in_progress") return "bg-yellow-100 text-yellow-700";
    if (status === "resolved") return "bg-green-100 text-green-700";
  };

  return <span className={`text-[10px] px-2 py-0.5 rounded-full ${getClass()}`}>{status}</span>;
}
