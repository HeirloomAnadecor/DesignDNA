import React from "react";
import { Project } from "../types";
import { EL } from "../data";

interface ProjectBannerProps {
  project: Project;
  height?: number;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({ project, height = 155 }) => {
  const elColors = project.elements.map(e => EL[e].color);
  const grad = elColors.length > 1
    ? `linear-gradient(135deg, ${elColors[0]}33 0%, #0A0A0A 50%, ${elColors[elColors.length - 1]}33 100%)`
    : `linear-gradient(135deg, ${elColors[0]}40 0%, #0A0A0A 70%)`;
  return (
    <div style={{ height: `${height}px`, background: grad, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, fontSize: `${height * 0.9}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1' }}>
        {project.elements.map(e => EL[e].icon).join('')}
      </div>
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 16px' }}>
        <div style={{ fontSize: `${Math.round(height * 0.13)}px`, letterSpacing: '2px', color: '#EEE8DC', fontWeight: '300', fontStyle: 'italic', marginBottom: '4px' }}>{project.name}</div>
        <div style={{ width: '30px', height: '1px', background: elColors[0], margin: '0 auto 6px', opacity: 0.6 }} />
        <div style={{ fontSize: `${Math.round(height * 0.07)}px`, letterSpacing: '2px', color: elColors[0], textTransform: 'uppercase' }}>{project.style}</div>
      </div>
    </div>
  );
};
