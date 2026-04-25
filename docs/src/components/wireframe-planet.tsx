"use client";

import { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
}

function createSpherePoints(count: number, radius: number): Point3D[] {
  const points: Point3D[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    points.push({
      x: radius * Math.sin(inclination) * Math.cos(azimuth),
      y: radius * Math.sin(inclination) * Math.sin(azimuth),
      z: radius * Math.cos(inclination),
    });
  }
  return points;
}

function rotateY(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
}

function rotateX(point: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
}

function project(
  point: Point3D,
  width: number,
  height: number,
  fov: number
): ProjectedPoint {
  const scale = fov / (fov + point.z);
  return {
    x: point.x * scale + width / 2,
    y: point.y * scale + height / 2,
    scale,
  };
}

export default function WireframePlanet({ dark = true }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const darkRef = useRef(dark);

  // Keep the ref in sync
  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const POINT_COUNT = 200;
    const RADIUS = Math.min(width, height) * 0.32;
    const CONNECTION_DISTANCE = RADIUS * 0.55;
    const FOV = 600;

    const points = createSpherePoints(POINT_COUNT, RADIUS);

    // Create ring points (equator + meridians)
    const ringPoints: Point3D[] = [];
    const ringSegments = 80;
    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      // Equator
      ringPoints.push({
        x: RADIUS * Math.cos(angle),
        y: 0,
        z: RADIUS * Math.sin(angle),
      });
      // Meridian 1
      ringPoints.push({
        x: RADIUS * Math.cos(angle),
        y: RADIUS * Math.sin(angle),
        z: 0,
      });
      // Meridian 2
      ringPoints.push({
        x: 0,
        y: RADIUS * Math.cos(angle),
        z: RADIUS * Math.sin(angle),
      });
    }

    let angleY = 0;
    const angleX = 0.3; // slight tilt

    const animate = () => {
      const isDark = darkRef.current;
      const dotColor = isDark ? "245, 245, 240" : "15, 15, 30";
      const currentRadius = Math.min(width, height) * 0.32;
      ctx.clearRect(0, 0, width, height);

      angleY += 0.003;

      // Transform and project all points
      const transformedPoints = points.map((p) => {
        // Scale points to current radius
        const scaled = {
          x: (p.x / RADIUS) * currentRadius,
          y: (p.y / RADIUS) * currentRadius,
          z: (p.z / RADIUS) * currentRadius,
        };
        const rotated = rotateY(rotateX(scaled, angleX), angleY);
        return { ...rotated, projected: project(rotated, width, height, FOV) };
      });

      // Draw connections
      for (let i = 0; i < transformedPoints.length; i++) {
        for (let j = i + 1; j < transformedPoints.length; j++) {
          const a = transformedPoints[i];
          const b = transformedPoints[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECTION_DISTANCE) {
            const opacity =
              (1 - dist / CONNECTION_DISTANCE) *
              0.3 *
              a.projected.scale *
              b.projected.scale;
            ctx.beginPath();
            ctx.moveTo(a.projected.x, a.projected.y);
            ctx.lineTo(b.projected.x, b.projected.y);
            ctx.strokeStyle = `rgba(${dotColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw ring wireframes
      const transformedRing = ringPoints.map((p) => {
        const scaled = {
          x: (p.x / RADIUS) * currentRadius,
          y: (p.y / RADIUS) * currentRadius,
          z: (p.z / RADIUS) * currentRadius,
        };
        const rotated = rotateY(rotateX(scaled, angleX), angleY);
        return { ...rotated, projected: project(rotated, width, height, FOV) };
      });

      // Draw ring connections (connect sequential ring points)
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        for (let i = 0; i < ringSegments; i++) {
          const idx = i * 3 + ring;
          const nextIdx = ((i + 1) % ringSegments) * 3 + ring;
          const a = transformedRing[idx];
          const b = transformedRing[nextIdx];
          const opacity = 0.08 * ((a.projected.scale + b.projected.scale) / 2);
          ctx.strokeStyle = `rgba(${dotColor}, ${opacity})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(a.projected.x, a.projected.y);
          ctx.lineTo(b.projected.x, b.projected.y);
          ctx.stroke();
        }
      }

      // Draw dots
      for (const point of transformedPoints) {
        const { projected } = point;
        const size = 1.5 * projected.scale;
        const opacity = 0.5 + 0.5 * projected.scale;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${opacity})`;
        ctx.fill();
      }

      // Glow effect in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        currentRadius * 1.5
      );
      gradient.addColorStop(0, `rgba(${dotColor}, 0.02)`);
      gradient.addColorStop(0.5, `rgba(${dotColor}, 0.01)`);
      gradient.addColorStop(1, `rgba(${dotColor}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
