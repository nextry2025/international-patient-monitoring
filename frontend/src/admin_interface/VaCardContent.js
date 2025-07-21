import React from 'react';
const VaCardContent = ({ title, subtitle, description, imageUrl, actions }) => {
    return (
        <div className="va-card-content">
            {imageUrl && <img src={imageUrl} alt={title} className="va-card-image" />}
            <div className="va-card-body">
                <h2 className="va-card-title">{title}</h2>
                {subtitle && <h3 className="va-card-subtitle">{subtitle}</h3>}
                <p className="va-card-description">{description}</p>
                {actions && <div className="va-card-actions">{actions}</div>}
            </div>
        </div>
    );
};

export default VaCardContent;
