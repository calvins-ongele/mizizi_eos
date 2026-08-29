"use client";


  async function handleLogout(e:any) {
    e.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

export function LogoutButton() { 

  

  return ( 
    <a
      href="/logout" onClick={handleLogout}
      className="btn btn-primary d-flex align-items-center justify-content-center"
    >
      <i className="bi bi-box-arrow-right me-2"></i>Logout
    </a>
  );
}

export function IconLogoutBtn() {
  return (
    <a
        href="/logout" onClick={handleLogout}
        className="settings-icon"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Logout"
      >
        <i className="bi bi-power"></i>
      </a>
  );
}
