import { RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useClient } from "./hooks/useClient";
import { router } from "./router";

function App() {
  const [info, logout] = useAuth();
  useClient();

  const content = info ? (
    <RouterProvider router={router} />
  ) : (
    <div className="flex w-full justify-center content-center items-center bg-gradient-to-br from-[#d734b96b] via-[#53265f66] to-[#4c045e66]">
      <div className="flex flex-col gap-2 backdrop-blur-md p-6 w-[500px] shadow-sm rounded-lg bg-gradient-to-br from-[#6e626b6b] to-[#66127b66]">
        <h1 className="text-4xl font-bold">Авторизация...</h1>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex justify-between bg-gradient-to-br from-[#48043b] to-[#56073b]">
      <div className="drag-handle w-screen h-10 fixed"></div>
      {/* <div className="bg-gradient-to-b w-[250px] from-[#390036] to-[#35002c]">
        <div>
          <div>
            <div>sawaxon</div>
            <div></div>
          </div>
          <div>[Ava]</div>
        </div>
      </div> */}
      {content}
    </div>
  );
}

export default App;
