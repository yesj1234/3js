export class BaseLightGUI {
    constructor(folder, light, helper) {
        this.folder = folder; // gui folder. injected as dependency
        this.light = light;     
    }
    

    setColor() {
        this.folder.addColor(this.light, 'color')
    }
    setIntensity() {
        this.folder.add(this.light, 'intensity').min(0).max(10).step(0.1)
    }
    
    init(){
        this.setColor()
        this.setIntensity()
    }

    
}

export class AmbientLightGUI extends BaseLightGUI {
    constructor(folder, light) {
        super(folder, light)
        super.init()        
    }
}

export class DirectionalLightGUI extends BaseLightGUI {
    constructor(folder, light, helper) {
        super(folder, light);
        super.init();
        this.helper = helper;
        this.init();
    }
    setPosition() {
        const positionFolder = this.folder.addFolder("position")
        positionFolder.add(this.light.position, "x").min(-10).max(10).step(0.1)
        positionFolder.add(this.light.position, "y").min(-10).max(10).step(0.1)
        positionFolder.add(this.light.position, "z").min(-10).max(10).step(0.1)
    }
    setHelper() {
        this.folder.add(this.helper, "visible").name("light camera helper")
    }
    setShadowMapSize() {
        this.light.shadow.mapSize.width = 1024; 
        this.light.shadow.mapSize.height = 1024;
    }
    castShadow() {
        this.light.castShadow = true; 
    }
    
    blur() {
        this.folder.add(this.light.shadow, "radius")
        .min(0).max(10).step(0.001).name("blur radius")
    }

    // Camera helper far and near is not dynamically updating. 
    shadowCameraDistance() {
        this.folder.add(this.light.shadow.camera,"near")
        .min(0).max(1).step(0.001).name("camera near")
        .onChange(v =>{
            // console.log(this.light.shadow.camera)
            this.light.shadow.camera.updateProjectionMatrix()
        })
        
        this.folder.add(this.light.shadow.camera,"far")
        .min(5).max(1000).step(0.001).name("camera far")
        .onChange(v => {
            this.light.shadow.camera.updateProjectionMatrix()
        })
    }

    init() {

        this.setPosition();
        this.setHelper();
        this.castShadow(); 
        this.shadowCameraDistance(); 
        this.blur();

    }
}