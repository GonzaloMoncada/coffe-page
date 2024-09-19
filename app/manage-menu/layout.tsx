import React from 'react';
import SkeletonManageMenu from '../ui/Skeletons/SkeletonManageMenu';

interface LayoutManagerProps {
  children: React.ReactNode;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default LayoutManager;
