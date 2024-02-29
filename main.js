import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();
// light intensity GUI
const lightTweaks = gui.addFolder("Light");
const lightIntensity = {
  AmbientLightIntensity: 1,
  DirectionalLightIntensity: 1,
  HemisphereLightIntensity: 0,
  PointLightIntensity: 1,
  RectAreaLightIntensity: 0,
  SpotLightIntensity: 0,
};
const lightClass = {
  AmbientLightIntensity: new THREE.AmbientLight("white",  Math.PI * 0.3),
  DirectionalLightIntensity: new THREE.DirectionalLight("white"),
  HemisphereLightIntensity: new THREE.HemisphereLight(),
  PointLightIntensity: new THREE.PointLight(),
  RectAreaLightIntensity: new THREE.RectAreaLight(),
  SpotLightIntensity: new THREE.SpotLight(0xffffff),
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
        if (["DirectionalLightIntensity", "PointLightIntensity", "SpotLightIntensity"].includes(key)) {
          // cast shadow for these 3 kinds of light 
          lightClass[key].castShadow = true;
          lightClass[key].shadow.mapSize.width = 1024;
          lightClass[key].shadow.mapSize.height = 1024;
          lightClass[key].shadow.camera.near = 1; 
          lightClass[key].shadow.camera.far = 150; 
          if (key == "SpotLightIntensity") {
            lightClass[key].position.set(camera.position.x, camera.position.y, camera.position.z);
            lightClass[key].angle = 0.45; 
            lightClass[key].penumbra = 0.3;
            lightClass[key].focus = 1;
            scene.add(lightClass[key].target);
            }
          if (key == "DirectionalLightIntensity") {
            lightClass[key].shadow.camera.top = 50
            lightClass[key].shadow.camera.right = 10
            lightClass[key].shadow.camera.bottom = - 10
            lightClass[key].shadow.camera.left = - 10

            lightClass[key].position.set(20, 20 , -10)
            console.log(lightClass[key].position)    
          }
        }
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
// scene.background = BLACK;
const gridHelper = new THREE.GridHelper(300, 300);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xA3A3A3);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = true; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.set(50, 20, 20);
camera.lookAt(new THREE.Vector3(0, 20, -10));
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.minDistance = 0; 
controls.maxDistance = 100; 

const planeGeo = new THREE.PlaneGeometry( 150, 150 );
const planeMat = new THREE.MeshPhongMaterial( {color: 0x00ff00, dithering: true} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.rotateX(Math.PI / 2)
scene.add( plane );
plane.receiveShadow = true;


const loader = new GLTFLoader();
loader.load(
  "/yanghak.glb",
  (gltf) => {
    const model = gltf.scene;
    model.traverse((node)=> {
      if(node.isMesh) {
        node.castShadow = true;
        // node.receiveShadow = true;
        // console.log(node)
        if (node.name == "octagonal_roof001") {
          node.visible = true; 
        } else {
          node.visible = false;
          node.position.set(3, 4, 5)
        }
      }
    })
    scene.add(model);
    // console.log(scene);
    console.log(model)
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

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
animate()