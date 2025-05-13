import React, { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { ThreeCanvas, ThreeCanvasCallbackProps } from '../lib/components/ThreeCanvas';

interface AppState {
  cube?: THREE.Mesh;
}

const App: React.FC = () => {
  const state = useRef<AppState>({});

  const mountHandler = useCallback(({ scene }: ThreeCanvasCallbackProps) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    state.current.cube = mesh;
  }, []);

  const unmountHandler = useCallback(() => {
    delete state.current.cube;
  }, []);

  const animationFrameHandler = useCallback(() => {
    const cube = state.current.cube!;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }, []);

  return (
    <ThreeCanvas
      onAnimationFrame={animationFrameHandler}
      onMount={mountHandler}
      onUnmount={unmountHandler}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default App;