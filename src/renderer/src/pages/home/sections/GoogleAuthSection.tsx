import formatIpcError from "@renderer/utils/format-ipc-error";

export default function GoogleAuthSection() {
  async function handleAuth() {
    const response = await window.api.google.startAuth();

    if (response.success) {
      window.alert(JSON.stringify(response.data?.tokens));
    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleAuth}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Autenticar com Google
      </button>
    </div>
  );
}