import React from 'react';

const ProjectCard = ({ project, role, currentUserId, onDelete, onJoin, onManage }) => {
  const isOwner = project.owner && project.owner.id === currentUserId;
  const isMember = project.members && project.members.some(member => member.id === currentUserId);

  return (
    <div className="project-card">
      <div className="card-header">
        <h4 className="project-title">{project.projectName}</h4>
        {isOwner && (
          <button
            className="delete-btn"
            onClick={() => onDelete(project.id)} 
            title="Șterge Proiectul"
          >
            Sterge proiect
          </button>
        )}
      </div>

      <p>
        <strong>Repo:</strong> 
        <a 
          href={project.repositoryName} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          {project.repositoryName}
        </a>
      </p>

      {project.owner && (
        <p className="owner-text">Owner: {project.owner.email}</p>
      )}

      {role === "MP" || isMember ? (
        <button
          className="details-btn"
          onClick={() => onManage(project.id)}
        >
          {role === "MP" ? "Detalii proiect" : "Raportează Bug-uri"}
        </button>
      ) : (
        <button
          className="details-btn join-btn"
          onClick={() => onJoin(project.id)}
        >
          Join
        </button>
      )}
    </div>
  );
};

export default ProjectCard;