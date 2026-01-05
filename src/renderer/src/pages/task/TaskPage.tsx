import { useNavigate, useParams } from "react-router-dom";

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Task Page</h1>
      <p> ID: {id} </p>

      <button
        className={`px-2 py-1 rounded bg-blue-600 cursor-pointer`}
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    </div>
  );
}