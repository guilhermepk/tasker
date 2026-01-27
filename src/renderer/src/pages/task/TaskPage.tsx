import formatIpcError from "@renderer/utils/format-ipc-error";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { FindTaskByIdResponse } from "@shared/models/responses/tasks/find-task-by-id.response";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskCard } from "../home/components/TaskCard";
import { TaskData } from "@renderer/contexts/HomeContext";

export default function TaskPage() {
  const location = useLocation()
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<FindTaskByIdResponse>();

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const response: IpcResponse<FindTaskByIdResponse> = await window.api.tasks.findById({ id });

      if (response.success) {
        setTask(response.data);
      } else {
        window.alert(formatIpcError(response.error));
      }
    }

    fetchTask();
  }, [id]);

  function BackButton() {
    return (
      <button
        className={`px-2 py-1 rounded bg-blue-600 cursor-pointer`}
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    );
  }

  if (!task) return (
    <div className="flex items-center justify-center flex-col gap-4">
      <p> Nenhum ID recebido: {id} </p>
      <p> {location.pathname + location.search} </p>

      <BackButton />
    </div>
  );

  return (
    <div
      className={`flex items-center justify-baseline flex-col gap-4 w-screen min-h-screen border border-[red]`}
    >
      <h1 className="text-3xl"> {task.title} </h1>
      <p> {task.completed ? 'Concluído' : 'Pendente'} </p>

      {task.fatherTask
        ? (
          <div>
            <p> Tarefa pai: </p>

            <TaskCard
              className=""
              key={task.fatherTask.id}
              task={{ ...task.fatherTask, childrenTasks: task.fatherTask.childrenTasks ? task.fatherTask.childrenTasks as TaskData[] : [] }}
              updatable
              deletable
              canAddSubtask
            />
          </div>
        )
        : (
          <p><i className="opacity-50"> Nenhuma tarefa pai </i></p>
        )
      }

      {task.childrenTasks && task.childrenTasks.length > 0
        ? (
          <div>
            <p> Filhas: </p>
            <div className="w-full">
              {task.childrenTasks.map(childTask => (
                // <li
                //   key={childTask.id}
                //   className="cursor-pointer hover:text-blue-600"
                //   onClick={() => navigate(routes.taskPage.path(String(childTask.id)))}
                // >
                //   {childTask.title}
                // </li>

                <TaskCard
                  className=""
                  key={childTask.id}
                  task={{ ...childTask, childrenTasks: childTask.childrenTasks ? childTask.childrenTasks as TaskData[] : [] }}
                  updatable
                  deletable
                  canAddSubtask
                />
              ))}
            </div>
          </div>
        )
        : (
          <p><i className="opacity-50"> Nenhuma tarefa filha </i></p>
        )
      }

      <BackButton />
    </div>
  );
}