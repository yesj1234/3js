import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 0, 10);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
const loader = new GLTFLoader();
loader.load(
  "/sorceress.glb",
  (gltf) => {
    console.log(gltf);
    const model = gltf.scene;
    // model.scale.set(0.1, 0.1, 0.1);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
