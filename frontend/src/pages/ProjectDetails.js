import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();//extrage id ul din url
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    severity: "Medium",
    priority: "Medium",
    commit_link: ""
  });
  const [resolutionLinks, setResolutionLinks] = useState({});

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = parseInt(localStorage.getItem("userId"));

      const response = await fetch(`${API_BASE_URL}/api/project/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Eroare la încărcarea proiectului");
      }

      setProject(data);
      setIsOwner(data.owner && data.owner.id === userId);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId"));
    setCurrentUserId(userId);

    fetchProjectDetails();
  }, [navigate, fetchProjectDetails]);

  const handleDeleteMember = async (member) => {
    if (
      !window.confirm(`Ești sigur că vrei să elimini membru ${member.email}?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/project-members`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: member.id,
            projectId: id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Eroare la eliminarea membrului");
      }

      alert("Membru eliminat cu succes!");
      fetchProjectDetails();
    } catch (err) {
      alert(err.message || "Eroare la eliminarea membrului");
    }
  };

  if (loading) {
    return (
      <div className="project-details-container">
        <p>Se încarcă...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-details-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          Înapoi la Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-container">
        <p>Proiectul nu a fost găsit.</p>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          Înapoi la Dashboard
        </button>
      </div>
    );
  }



  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReportBug = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, projectId: id })
      });

      if (!response.ok) throw new Error("Eroare la raportare bug");

      setFormData({ description: "", severity: "Medium", priority: "Medium", commit_link: "" });
      fetchProjectDetails();
    } catch (err) {
      setError(err.message);
    }
  };


//alocare bug
  const handleAssignBug = async (bugId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bugs/${bugId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ assignedToId: currentUserId })
      });

      if (!response.ok) throw new Error("Eroare la alocare bug");
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveBug = async (bugId) => {
    try {
      const link = resolutionLinks[bugId];
      if (!link || !link.trim()) {
        alert("Te rog să introduci un link de commit pentru a marca bug-ul ca rezolvat.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/bugs/${bugId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bugStatus: "RESOLVED", commit_link: resolutionLinks[bugId] })
      });

      if (!response.ok) throw new Error("Eroare la rezolvare bug");
      setResolutionLinks({ ...resolutionLinks, [bugId]: "" });
      fetchProjectDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="project-details-container">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        ← Înapoi la Dashboard
      </button>

      {/* Zona 1 - Header */}
      <div className="project-header">
        <h1 className="project-title">{project.projectName}</h1>
        <div className="header-info">
          <div className="info-item">
            <strong>Repository:</strong>{" "}
            <a
              href={project.repositoryName}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-link"
            >
              {project.repositoryName}
            </a>
          </div>
          {project.owner && (
            <div className="info-item">
              <strong>Owner:</strong> {project.owner.email}
            </div>
          )}
        </div>
      </div>

      {/* Zona 2 - Echipa */}
      <div className="section">
        <h2>Echipa</h2>
        {project.members || project.owner ? (
          <div className="members-list">
            {/* Afisam Owner-ul primul */}
            {project.owner && (
              <div key={`owner-${project.owner.id}`} className="member-item" style={{ borderLeft: "4px solid #007bff" }}>
                <div className="member-info">
                  <span className="member-email">{project.owner.email}</span>
                  <span className="member-role">({project.owner.role}) - <strong>OWNER</strong></span>
                </div>
              </div>
            )}

            {/* Apoi restul membrilor */}
            {project.members && project.members.map((member) => (
              <div key={member.id} className="member-item">
                <div className="member-info">
                  <span className="member-email">{member.email}</span>
                  <span className="member-role">({member.role})</span>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleDeleteMember(member)}
                    className="delete-member-btn"
                  >
                    Elimină
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Nu există membri în echipă.</p>
        )}
      </div>

      {/* Formular Raportare Bug (doar TST) */}
      {localStorage.getItem("role") === "TST" && (
        <div className="section">
          <h2>Raporteaza un Bug</h2>
          <form onSubmit={handleReportBug} className="bug-form">
            <textarea name="description" placeholder="Descriere bug" value={formData.description} onChange={handleInputChange} required />
            <div className="form-group">
              <label>Severitate</label>
              <select name="severity" value={formData.severity} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prioritate</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <input type="text" name="commit_link" placeholder="Link Commit (optional)" value={formData.commit_link} onChange={handleInputChange} />
            <button type="submit">Raporteaza Bug</button>
          </form>
        </div>
      )}

      {/* Zona 3 - Lista de Bug-uri */}
      <div className="section">
        <h2>Bug-uri</h2>
        {project.bugs && project.bugs.length > 0 ? (
          <div className="bugs-grid">
            {project.bugs.map((bug) => (
              <div key={bug.id} className="bug-card">
                <div className="bug-description">
                  <strong>Descriere:</strong>{" "}
                  {bug.description || "Fără descriere"}
                </div>
                <div className="bug-details">
                  <div className="bug-detail-item">
                    <strong>Severitate:</strong>{" "}
                    <span
                      className={`severity-badge severity-${bug.severity?.toLowerCase()}`}
                    >
                      {bug.severity || "N/A"}
                    </span>
                  </div>
                  <div className="bug-detail-item">
                    <strong>Prioritate:</strong>{" "}
                    <span
                      className={`priority-badge priority-${bug.priority?.toLowerCase()}`}
                    >
                      {bug.priority || "N/A"}
                    </span>
                  </div>
                  <div className="bug-detail-item">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`status-badge status-${bug.bugStatus
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {bug.bugStatus || "N/A"}
                    </span>
                  </div>
                  <div className="bug-detail-item">
                    <strong>Alocat lui:</strong> {bug.assignedTo ? bug.assignedTo.email : "Nealocat"}
                  </div>
                  {bug.commit_link && (
                    <div className="bug-detail-item">
                      <strong>Solutie:</strong> <a href={bug.commit_link} target="_blank" rel="noopener noreferrer" className="commit-link">Vezi rezolvarea</a>
                    </div>
                  )}

                  {/* Actiuni MP */}
                  {localStorage.getItem("role") === "MP" && !bug.assignedToId && (
                    <button onClick={() => handleAssignBug(bug.id)} className="assign-btn">Aloca-mi mie</button>
                  )}
                  {localStorage.getItem("role") === "MP" && bug.assignedToId === currentUserId && (
                    <div className="resolve-container">
                      <input
                        type="text"
                        placeholder="Link Commit Rezolvare"
                        value={resolutionLinks[bug.id] || ""}
                        onChange={(e) => setResolutionLinks({ ...resolutionLinks, [bug.id]: e.target.value })}
                      />
                      <button onClick={() => handleResolveBug(bug.id)} className="resolve-btn">
                        {bug.bugStatus === "RESOLVED" ? "Actualizeaza rezolvare" : "Marcheaza ca Rezolvat"}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Nu există bug-uri raportate.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
