// src/components/SectionTemplate.jsx
export const SectionTemplate = ({ title, content, image }) => {
  return (
    <div className="section-container">
      <h2>{title}</h2>
      <div className="content-grid">
        <p>{content}</p>
        <img src={image} alt={title} />
      </div>
    </div>
  );
};