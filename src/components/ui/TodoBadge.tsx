import React from 'react';
import Tag from './Tag';
import { IS_DEV } from '../../utils/todo';

/** Renders only in `gatsby develop`, so unfilled data is visible to the author and invisible in production. */
const TodoBadge: React.FC<{ label?: string }> = ({ label = 'TODO' }) => {
  if (!IS_DEV) return null;
  return <Tag tone="amber">{label}</Tag>;
};

export default TodoBadge;
