let toastId = 0;

function emit(type, message) {
  window.dispatchEvent(
    new CustomEvent("fourai:toast", { detail: { id: ++toastId, type, message } })
  );
}

export const toast = {
  success: (message) => emit("success", message),
  error: (message) => emit("error", message),
  info: (message) => emit("info", message),
};
