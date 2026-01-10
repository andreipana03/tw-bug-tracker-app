import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState([]);

  // Lista utilizatorilor disponibili pentru a fi adăugați în echipă (doar MP)
  const [availableMPs, setAvailableMPs] = useState([]);

  const [newProject, setNewProject] = useState({
    projectName: "",
    repositoryName: "",
    teamMembers: [],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userRole = localStorage.getItem("role");
    setRole(userRole);

    fetchProjects();

    if (userRole === "MP") {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        const currentUserId = parseInt(localStorage.getItem("userId"));

        const mpUsers = data.filter(
          (u) => u.role === "MP" && u.id !== currentUserId
        );

        setAvailableMPs(mpUsers);
      }
    } catch (err) {
      console.error("Eroare la încărcarea utilizatorilor:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/project`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      } else {
        console.error("Eroare fetch projects:", data);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  const handleMemberSelect = (userId) => {
    setNewProject((prevState) => {
      const isSelected = prevState.teamMembers.includes(userId);
      if (isSelected) {
        return {
          ...prevState,
          teamMembers: prevState.teamMembers.filter((id) => id !== userId),
        };
      } else {
        return {
          ...prevState,
          teamMembers: [...prevState.teamMembers, userId],
        };
      }
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Eroare la creare proiect");
      }

      setNewProject({ projectName: "", repositoryName: "", teamMembers: [] });
      fetchProjects();
      alert("Proiect creat cu succes!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Funcția pentru TST care da join
  const handleJoinProject = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${API_BASE_URL}/api/project-members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: projectId,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          alert("Ești deja membru în acest proiect!");
        } else {
          throw new Error(data.message || "Eroare la join proiect");
        }
      } else {
        alert("Te-ai alăturat proiectului cu succes!");
        fetchProjects();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    // Confirmare simplă
    if (!window.confirm("Ești sigur că vrei să ștergi acest proiect?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/project/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Proiect șters cu succes.");
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.message || "Eroare la ștergere.");
      }
    } catch (err) {
      console.error("Eroare server:", err);
    }
  };

  const handleManageProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const currentUserId = parseInt(localStorage.getItem("userId"));

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Bug Tracker</h1>
        <div className="user-info">
          <span>
            Logat ca: <strong>{role}</strong>
          </span>
        </div>
      </header>

      {role === "MP" && (
        <div className="create-project-section">
          <h3>Creează un Proiect Nou</h3>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleCreateProject} className="project-form">
            <div className="form-row">
              <input
                type="text"
                className="form-input"
                placeholder="Nume proiect"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
                required
              />
              <input
                type="url"
                className="form-input"
                placeholder="Link Repository"
                value={newProject.repositoryName}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    repositoryName: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group-margin">
              <p className="label-bold">Selectează echipa (colegi MP):</p>
              <div className="members-selection">
                {availableMPs.length === 0 ? (
                  <p className="text-muted-small">
                    Nu există alți membri MP înregistrați.
                  </p>
                ) : (
                  availableMPs.map((user) => (
                    <div key={user.id} className="member-checkbox">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={newProject.teamMembers.includes(user.id)}
                        onChange={() => handleMemberSelect(user.id)}
                      />
                      <label htmlFor={`user-${user.id}`}>{user.email}</label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="add-btn">
              Creează Proiect
            </button>
          </form>
        </div>
      )}

      <h3>{role === "MP" ? "Proiectele Mele" : "Proiecte Disponibile"}</h3>

      {projects.length === 0 ? (
        <p>Nu există proiecte de afișat.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              role={role}
              currentUserId={currentUserId}
              onDelete={handleDeleteProject}
              onJoin={handleJoinProject}
              onManage={handleManageProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
