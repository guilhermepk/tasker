import { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router";

const TaskPage: Component = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Task Page</h1>
      <p>{id}</p>

      <button
        onClick={() => navigate(-1)}
        class={`
          px-4 py-2 bg-[purple] rounded-[10px] cursor-pointer
        `}
      >
        Voltar
      </button>
    </div>
  );
}

export default TaskPage;