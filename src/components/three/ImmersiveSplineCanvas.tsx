"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import { Camera, Mesh, Vector3 } from "three";

import Spline from "@splinetool/react-spline";

const SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type ImmersiveSplineCanvasProps = {
  onLoad: () => void;
  active: boolean;
};

type SplineInternals = Application & {
  _scene?: { getObjectByName: (name: string) => Mesh | undefined };
  _camera?: Camera;
};

export default function ImmersiveSplineCanvas({
  onLoad, active,
}: ImmersiveSplineCanvasProps) {
  const [app, setApp] = useState<Application | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const syncTimerRef = useRef<number | null>(null);

  const syncLogoToChest = useCallback((application: Application) => {
    const internals = application as SplineInternals;
    const body = internals._scene?.getObjectByName("Body");
    const camera = internals._camera;
    const canvas = application.canvas;
    const logo = logoRef.current;

    if (!body || !camera || !logo) return;

    body.geometry.computeBoundingBox();
    const bounds = body.geometry.boundingBox;
    if (!bounds) return;

    body.updateWorldMatrix(true, false);
    camera.updateMatrixWorld();

    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    center.y += size.y * 0.14;

    const left = center.clone();
    const right = center.clone();
    left.x -= size.x * 0.19;
    right.x += size.x * 0.19;

    const project = (point: Vector3) => {
      const projected = body.localToWorld(point).project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * canvas.clientWidth,
        y: (-projected.y * 0.5 + 0.5) * canvas.clientHeight,
        z: projected.z,
      };
    };

    const chest = project(center.clone());
    const chestLeft = project(left);
    const chestRight = project(right);
    const width = Math.hypot(
      chestRight.x - chestLeft.x,
      chestRight.y - chestLeft.y,
    );
    const rotation = Math.atan2(
      chestRight.y - chestLeft.y,
      chestRight.x - chestLeft.x,
    );
    const visible =
      chest.z > -1 && chest.z < 1 &&
      chest.x > -width && chest.x < canvas.clientWidth + width &&
      chest.y > -40 && chest.y < canvas.clientHeight + 40;

    logo.style.left = `${chest.x}px`;
    logo.style.top = `${chest.y}px`;
    logo.style.width = `${Math.max(54, Math.min(width, 190))}px`;
    logo.style.opacity = visible ? "0.68" : "0";
    logo.style.transform =
      `translate(-50%, -50%) rotate(${rotation}rad)`;
  }, []);

  useEffect(() => {
    if (!app) return;

    if (!active) {
      app.stop();
      if (logoRef.current) logoRef.current.style.opacity = "0";
      return;
    }

    app.play();
    syncLogoToChest(app);
    // The Spline runtime owns its render loop. The HTML decal only needs a
    // lightweight 30fps position sync, avoiding a second full-speed RAF loop.
    syncTimerRef.current = window.setInterval(() => syncLogoToChest(app), 1000 / 30);

    return () => {
      if (syncTimerRef.current !== null) {
        window.clearInterval(syncTimerRef.current);
        syncTimerRef.current = null;
      }
      app.stop();
    };
  }, [active, app, syncLogoToChest]);

  const handleLoad = (application: Application) => {
    setApp(application);
    window.requestAnimationFrame(() => syncLogoToChest(application));
    onLoad();
  };

  return (
    <div className="immersive-canvas">
      <Spline scene={SCENE_URL} onLoad={handleLoad} />
      <div
        ref={logoRef}
        aria-hidden="true"
        className="immersive-body-logo"
      >
        <Image
          src="/images/logo/gsmfeed-logo.svg"
          alt=""
          width={40}
          height={19}
          className="immersive-body-logo-symbol"
        />
        <Image
          src="/images/logo/gsmfeed-full-logo.png"
          alt=""
          width={294}
          height={75}
          className="immersive-body-logo-wordmark"
        />
      </div>
    </div>
  );
}
