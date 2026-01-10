import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId"));
    setCurrentUserId(userId);

    fetchProjectDetails();
  }, [id, navigate]);

  const fetchProjectDetails = async () => {
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
  };

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
        {project.members && project.members.length > 0 ? (
          <div className="members-list">
            {project.members.map((member) => (
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
                      className={`status-badge status-${bug.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {bug.status || "N/A"}
                    </span>
                  </div>
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
