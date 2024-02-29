import * as THREE from 'three'
import GUI from "lil-gui";
import { AmbientLightGUI, DirectionalLightGUI } from './utils/lightGUI/lightGUI';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Constants
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const WHITE = new THREE.Color("rgb(255, 255, 255)")
const BLACK = new THREE.Color("rgb(0, 0, 0)")
const RED = new THREE.Color("rgb(255, 0, 0)")
const GREEN = new THREE.Color("rgb(0, 255, 0)")
const BLUE = new THREE.Color("rgb(0, 0, 255)")
const GRAY = new THREE.Color("rgb(128, 128, 128)")

//Canvas 
const canvas = document.querySelector("canvas.webgl")

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = BLACK;


/**
 * Textures
 */

/**
 * Lights 
 */
const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight()
directionalLight.shadow.camera.near = 0;
directionalLight.shadow.camera.far = 5;

scene.add(directionalLight);

/**
 * Materials
 */
// const material = new THREE.MeshStandardMaterial({color: 0x808080 })
// material.roughness = 0.7;

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.7
    })
)
sphere.position.y = 0.5;
sphere.castShadow = true; 

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.7})
)
plane.receiveShadow = true; 
plane.rotation.x = - Math.PI * 0.5
// plane.position.y = - 0.5 
scene.add(sphere, plane)

/**
 * Helper 
 */
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper(5, 5); 
scene.add(gridHelper);
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(1, 1, 2)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)
/**
 * Controls
 */
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.enableDamping = true; 
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug lil-gui 
 */
const gui = new GUI();
const ambientLightFolder = gui.addFolder("AmbientLight")
const ambientLightGUI = new AmbientLightGUI(ambientLightFolder, ambientLight);
const directionalLightFolder = gui.addFolder("DirectionalLight")
const directionalLightGUI = new DirectionalLightGUI(directionalLightFolder, directionalLight, directionalLightCameraHelper); 


/**
 * Animate
 */
const clock = new THREE.Clock() 
const tick = () => {
    const elapsedTime = clock.getElapsedTime(); 
    // sphere.position.set(
    //     Math.cos(elapsedTime) * 1.5,
    //     Math.cos(elapsedTime) * 1.5,
    //     Math.abs(Math.sin(elapsedTime * 3))
    //     )
    // sphere shadow todo
    // console.log(parseInt(elapsedTime))
    // if (elapsedTime != 0 && parseInt(elapsedTime) % 3 == 0 && elapsedTime.toString().split(".")[1].slice(0, 2) == "12") {
    //     console.log(directionalLight.shadow.radius)
    // }
    orbitControl.update() 
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick();

window.addEventListener('resize', ()=> {
    sizes.width = window.innerWidth; 
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height; 
    camera.updateProjectionMatrix(); 

    renderer.setSize(sizes.innerWidth, sizes.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})