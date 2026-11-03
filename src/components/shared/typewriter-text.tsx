'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
}

export function TypewriterText({
  text,
  className = '',
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDelay = 1000,
}: TypewriterTextProps) {
  const roles = text
    .split(',')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (roles.length <= 1) return;

    const currentRole = roles[roleIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDelay);
      return () => clearTimeout(pauseTimeout);
    }

    if (!isDeleting && charIndex < currentRole.length) {
      const typeTimeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(typeTimeout);
    }

    if (!isDeleting && charIndex === currentRole.length) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && charIndex > 0) {
      const deleteTimeout = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
      return () => clearTimeout(deleteTimeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
  }, [charIndex, isDeleting, isPaused, roleIndex, roles, typingSpeed, deletingSpeed, pauseDelay]);

  useEffect(() => {
    setRoleIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
    setIsPaused(false);
  }, [text]);

  if (roles.length === 0) {
    return <span className={className}>{text}</span>;
  }

  if (roles.length === 1) {
    return (
      <span className={className}>
        {roles[0]}
        <span className="ml-[1px] inline-block animate-pulse">|</span>
      </span>
    );
  }

  const currentRole = roles[roleIndex];
  const displayed = currentRole.slice(0, charIndex);

  return (
    <span className={className}>
      {displayed}
      <span className="ml-[1px] inline-block animate-pulse">|</span>
    </span>
  );
}

