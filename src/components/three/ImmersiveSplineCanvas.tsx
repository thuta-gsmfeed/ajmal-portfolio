"use client";

import "@splinetool/runtime";

import Spline from "@splinetool/react-spline";

const SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type ImmersiveSplineCanvasProps = {
  onLoad: () => void;
};

export default function ImmersiveSplineCanvas({
  onLoad,
}: ImmersiveSplineCanvasProps) {
  return <Spline scene={SCENE_URL} onLoad={onLoad} />;
}
