import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();
const lightTweaks = gui.addFolder("Light");
const lightIntensity = {
  AmbientLightIntensity: 0,
  DirectionalLightIntensity: 0,
  HemisphereLightIntensity: 0,
  PointLightIntensity: 0,
  RectAreaLightIntensity: 0,
  SpotLightIntensity: 0,
};
const lightClass = {
  AmbientLightIntensity: new THREE.AmbientLight(),
  DirectionalLightIntensity: new THREE.DirectionalLight(),
  HemisphereLightIntensity: new THREE.HemisphereLight(),
  PointLightIntensity: new THREE.PointLight(),
  RectAreaLightIntensity: new THREE.RectAreaLight(),
  SpotLightIntensity: new THREE.SpotLight(),
};
for (let key in lightIntensity) {
  lightTweaks
    .add(lightIntensity, key)
    .min(0)
    .max(100)
    .step(0.1)
    .onChange((value) => {
      if (value != 0) {
        lightClass[key].intensity = value;
        scene.add(lightClass[key]);
      } else {
        scene.remove(lightClass[key]);
      }
    });
}

/**
 * Constants
 */

const WHITE = new THREE.Color(0xffffff);
const BLACK = new THREE.Color(0x000000);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
scene.background = WHITE;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const gridHelper = new THREE.GridHelper(300, 300);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(0, 20, 50);
camera.lookAt(new THREE.Vector3(0, 20, -10));
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const material = new THREE.MeshPhysicalMaterial({});

const loader = new GLTFLoader();
loader.load(
  "/yanghak.glb",
  (gltf) => {
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

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // camera.position.set(
  //   Math.sin(elapsedTime * 0.25) * 50,
  //   30,
  //   Math.cos(elapsedTime * 0.25) * 50
  // );

  // camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(animate);
}
animate();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
