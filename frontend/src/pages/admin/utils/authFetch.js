export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Añadimos el token actual al header
  options.headers = {
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  // Si el token expiró, intentamos renovarlo
  if (response.status === 401 && refreshToken) {
    console.warn("Token expirado, intentando refrescar...");

    const refreshResponse = await fetch("http://127.0.0.1:8000/api/token/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      console.log("Nuevo token recibido ✅");

      // Guardamos el nuevo token
      localStorage.setItem("token", data.token);

      // Reintentamos la petición original con el nuevo token
      options.headers["Authorization"] = `Bearer ${data.token}`;
      response = await fetch(url, options);
    } else {
      console.error("Error al refrescar token, redirigiendo al login");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return;
    }
  }

  return response;
}
