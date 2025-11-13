export async function authFetch(url, options = {}) {
  const API_BASE = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Añadimos el token a la cabecera
  options.headers = {
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  // Si el token expira, intentamos renovarlo
  if (response.status === 401 && refreshToken) {
    console.warn("⚠️ Token expirado. Intentando refrescar...");

    const refreshResponse = await fetch(`${API_BASE}/api/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      console.log("✅ Nuevo token recibido.");

      localStorage.setItem("token", data.token);

      // Reintentamos la petición original con el nuevo token
      options.headers["Authorization"] = `Bearer ${data.token}`;
      response = await fetch(url, options);
    } else {
      console.error("❌ Error al refrescar token. Redirigiendo al login.");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return;
    }
  }

  return response;
}
