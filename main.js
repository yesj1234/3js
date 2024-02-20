import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Constants
const WHITE = new THREE.Color(0xffffff);
const BLACK = new THREE.Color(0x000000);

const scene = new THREE.Scene();
scene.background = WHITE;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 20, 50);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

const material = new THREE.MeshPhysicalMaterial({});

const loader = new GLTFLoader();
loader.load(
  "/dynasty_clothe.glb",
  (gltf) => {
    console.log(gltf);
    const mesh = gltf.scene;
    // model.castShadow = true;
    // model.scale.set(0.1, 0.1, 0.1);
    scene.add(mesh);
    renderer.render(scene, camera);
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
