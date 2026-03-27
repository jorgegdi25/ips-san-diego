import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../ContentContext';
import type { Content } from '../ContentContext';

interface EditableTextProps {
  section: keyof Content;
  fieldPath: string; // e.g., 'title' or '0.description'
  value: string;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({ 
  section, 
  fieldPath, 
  value, 
  as: Component = 'span', 
  className = '',
  multiline = false
}: EditableTextProps) {
  const { isEditorActive, updateContentField } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      updateContentField(section, fieldPath, tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditorActive) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as any}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full bg-white text-black p-2 border-2 border-primary rounded shadow-lg z-50 ${className}`}
            rows={4}
            style={{ minHeight: '100px' }}
          />
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`w-full bg-white text-black p-2 border-2 border-primary rounded shadow-lg z-50 ${className}`}
          />
        )}
      </div>
    );
  }

  return (
    <Component 
      className={`${className} cursor-text outline-dashed outline-2 outline-amber-500/50 hover:outline-amber-500 hover:bg-amber-500/10 transition-all rounded px-1 relative group`}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Clic para editar"
    >
      {value}
      <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 material-symbols-outlined shadow-lg z-10 transition-opacity">
        edit
      </span>
    </Component>
  );
}
