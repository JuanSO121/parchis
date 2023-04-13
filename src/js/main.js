// Principales variables son:

var scene = null, //place
    camera = null, //to see
    renderer = null, //to represent
    myCanvas = null, //to draw
    controls = null, //to move
    
    cube = null,
    cone = null,
    cylinder = null;   

function start3dService() {
    initScene();        // To inicializate the project
    createDashboard();
    animate();          // To represent frame by frame (Update)...
    window.addEventListener('resize', onWindowResize, false);

    createGLTF();
    createObjMtl();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background=new THREE.Color(012075);
    camera = new THREE.PerspectiveCamera( 75,   // FOV (Fild of view)
                                        window.innerWidth / window.innerHeight, // ASPECT (Size of Screen)
                                        0.1,  // NEAR (Cerca)
                                        1000 ); //FAR (lejos)

    myCanvas = document.querySelector('.webgl'); 
    renderer = new THREE.WebGLRenderer({canvas: myCanvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene.add(camera);
    //make controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(10, 15, 10);
    controls.update();

    // Create Grid
    const size = 30;
    const divisions = 30;

    const gridHelper = new THREE.GridHelper(size, 
                                            divisions,
                                            0x000, //color cruz
                                            0xffffff);
    scene.add( gridHelper );

    //axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add( axesHelper );
    createLight('AmbientLight');
}


function createDashboard(){
 const geometry = new THREE.PlaneGeometry( 30, 30 );
 const loader = new THREE.TextureLoader();
 
 const material = new THREE.MeshBasicMaterial( {color: 0xffffff,
    map: loader.load('./src/img/textura_parchis.jpeg'),
    side: THREE.DoubleSide} );
 const plane = new THREE.Mesh( geometry, material );
 plane.rotation.x= Math.PI/2;
 scene.add( plane );
}

function createGLTF() {
    const loader = new THREE.GLTFLoader();

    const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath( '../src/models/GLTF/pato/' );
        loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    // loader.load(
    //     // resource URL
    //     '../src/models/gltf/pato/duck.gltf',
    //     // called when the resource is loaded
    //     function ( gltf ) {

    //         scene.add( gltf.scene );

    //         gltf.animations; // Array<THREE.AnimationClip>
    //         gltf.scene; // THREE.Group
    //         gltf.scenes; // Array<THREE.Group>
    //         gltf.cameras; // Array<THREE.Camera>
    //         gltf.asset; // Object

    //         (gltf.scene).position.set(-10,0,-10);
    //         (gltf.scene).scale.set(3,3,3);
    //     },
    //     // called while loading is progressing
    //     function ( xhr ) {

    //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    //     },
    //     // called when loading has errors
    //     function ( error ) {

    //         console.log( 'An error happened' );

    //     }
    // );
}

function createObjMtl(){
    const loader = new THREE.OBJLoader();
    const mtlLoader = new THREE.MTLLoader();

    mtlLoader.setTexturePath('../src/models/OBJMTL/Griffin/');
    mtlLoader.setPath('../src/models/OBJMTL/Griffin/');
    mtlLoader.load('grifo.mtl', function (materials) {

        materials.preload();

        loader.setMaterials(materials);
        loader.setPath('../src/models/OBJMTL/Griffin/');
        loader.load('grifo.obj', function (object) {
              scene.add(object);
              object.scale.set(2.5,2.5,2.5);
              object.position.set(10,0,10);
              object.rotation.y=7;
              
        });
    }); 

    mtlLoader.setTexturePath('../src/models/OBJMTL/Fenix/');
    mtlLoader.setPath('../src/models/OBJMTL/Fenix/');
    mtlLoader.load('fenix.mtl', function (materials) {

        materials.preload();

        loader.setMaterials(materials);
        loader.setPath('../src/models/OBJMTL/Fenix/');
        loader.load('fenix.obj', function (object) {
              scene.add(object);
              object.scale.set(2.5,2.5,2.5);
              object.position.set(10,0,-10);
              object.rotation.y=5;
        });
    });  
    
    // reemplazar esta
    mtlLoader.setTexturePath('../src/models/OBJMTL/Unicornio/');
    mtlLoader.setPath('../src/models/OBJMTL/Unicornio/');
    mtlLoader.load('unicornio.mtl', function (materials2) {

        materials2.preload();

        loader.setMaterials(materials2);
        loader.setPath('../src/models/OBJMTL/Unicornio/');
        loader.load('unicornio.obj', function (object) {
              scene.add(object);
              object.scale.set(2.5,2.5,2.5);
              object.position.set(-10,0,10);
              object.rotation.y=-7;
        });
    });  
    
        // reemplazar esta
        mtlLoader.setTexturePath('../src/models/OBJMTL/Elfa/');
        mtlLoader.setPath('../src/models/OBJMTL/Elfa/');
        mtlLoader.load('elfa.mtl', function (materials2) {
    
            materials2.preload();
    
            loader.setMaterials(materials2);
            loader.setPath('../src/models/OBJMTL/Elfa/');
            loader.load('elfa.obj', function (object) {
                  scene.add(object);
                  object.scale.set(4.2,4.2,4.2);
                  object.position.set(-10,0,-10);
                  object.rotation.y=7;
            });
        });  
    
    
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


function createLight(typeLight) {
    switch(typeLight) {
        case 'AmbientLight':
            const AmbientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
            scene.add( AmbientLight );
          break;
        case 'DirectionalLight':
            // White directional light at half intensity shining from the top.
            const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
            scene.add( directionalLight );
          break;
        case 'PointLight':
            const PointLight = new THREE.PointLight( 0xffffff, 1, 100 );
            PointLight.position.set( 0, 3, 0 );
            scene.add( PointLight );

            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper( PointLight, sphereSize );
            scene.add( pointLightHelper );
          break;
          
        case 'SpotLight': // pending
        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 10, 10, 10 );
        scene.add( spotLight );

        const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        scene.add( spotLightHelper );
          break;

        case 'SpotLightShadow':
            const renderer = new THREE.WebGLRenderer();
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

            //Create a SpotLight and turn on shadows for the light
            const light = new THREE.SpotLight( 0xffffff );
            light.castShadow = true; // default false
            scene.add( light );

            //Set up shadow properties for the light
            light.shadow.mapSize.width = 512; // default
            light.shadow.mapSize.height = 512; // default
            light.shadow.camera.near = 0.5; // default
            light.shadow.camera.far = 500; // default
            light.shadow.focus = 1; // default
            const helper = new THREE.CameraHelper( light.shadow.camera );
            scene.add( helper );

            break;

            case 'HemisphereLight':
                const HemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
                scene.add( HemisphereLight );
            break;

            case 'RectAreaLight':
                const width = 10;
                const height = 10;
                const intensity = 1;
                const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
                rectLight.position.set( 5, 5, 0 );
                rectLight.lookAt( 0, 0, 0 );
                scene.add( rectLight )

                const rectLightHelper = new RectAreaLightHelper( rectLight );
                rectLight.add( rectLightHelper );
            break;
      }
      
}

function createGeometries() {
    camera.position.z = 5;
}

function animate() {
    controls.update();
	requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // sphere.rotation.x += 0.02; // Rotar la esfera más rápido que el cubo
    // sphere.rotation.y += 0.02;

    //cada uno de los objetos que estan siendo recorridos
    // scene.traverse(function (object) {
    // if (object.isMesh ===true) {
    // object.rotation.x += 0.01;
    //  object.rotation.y += 0.01;
    // }
    // });
	renderer.render( scene, camera );
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}


console.log(THREE);