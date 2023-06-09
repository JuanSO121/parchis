// import * as dat from 'dat.gui';
// Principales variables son:

var scene = null, //place
    camera = null, //to see
    renderer = null, //to represent
    myCanvas = null, //to draw
    controls = null, //to move
    
    cube = null,
    cone = null,
    cylinder = null;   

var dados = [],
    rotate = false,
    jugador='blue',
    posPlayers = [{ x: 17.298156763549287, y: 17.59827012753881, z: 0.10151787289657402},  // Red
                    { x: -17.03050250551709, y: 16.04258871995021, z: -0.6035724405441485},  // Yellow
                    { x: -0.024321219262030, y: 15.91870264199188, z: 18.7967995615866},     // Blue
                    { x: -0.066898867944208, y: 17.59827012753881, z: -17.234319602002646}]; // Green

function start3dService() {
    initScene();  
          // To inicializate the project
    createDashboard();
    animate();          // To represent frame by frame (Update)...
    window.addEventListener('resize', onWindowResize, false);

    createObjMtl('./src/models/OBJMTL/Griffin/','grifo',10,0,10, 2,7,2);

    createObjMtl('./src/models/OBJMTL/Elfa/','elfa',-10,0,-10,4.2,7,3);

    createObjMtl('./src/models/OBJMTL/Fenix/','fenix',10,0,-10, 2.5,5,4);

    createObjMtl('./src/models/OBJMTL/Unicornio/','unicornio',-10,0,10, 2.5,-7,5);

    createLight('DirectionalLight');
    // Oculta la escena
    renderer.domElement.style.display = 'none';
}

function moveCameraToPlayer() {
    if (jugador === 'red') {
        camera.position.set(posPlayers[0].x, posPlayers[0].y, posPlayers[0].z);
    } else if (jugador === 'yellow') {
        camera.position.set(posPlayers[1].x, posPlayers[1].y, posPlayers[1].z);
    } else if (jugador === 'blue') {
        camera.position.set(posPlayers[2].x, posPlayers[2].y, posPlayers[2].z);
    } else if (jugador === 'green') {
        camera.position.set(posPlayers[3].x, posPlayers[3].y, posPlayers[3].z);
    }
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000); //0x043eaa
    camera = new THREE.PerspectiveCamera(75,   // FOV (Fild of view)
        window.innerWidth / window.innerHeight, // ASPECT (Size of Screen)
        0.1,  // NEAR (Cerca)
        1000); //FAR (lejos)

    myCanvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ canvas: myCanvas });
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 50);//window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // To make Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // if(jugador=='red')
    //     camera.position.set(posPlayers[0].x,posPlayers[0].y,posPlayers[0].z);
    // else if (jugador=='blue')
    //     camera.position.set(posPlayers[2].x,posPlayers[2].y,posPlayers[2].z);
    // else if (jugador=='yellow')
    //     camera.position.set(posPlayers[1].x,posPlayers[1].y,posPlayers[1].z);
    // else if (jugador=='green')
    //     camera.position.set(posPlayers[3].x,posPlayers[3].y,posPlayers[3].z);

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

function createObjMtl(routeFolder, nameArchive, posx, posy, posz, scale,rotation,number){
    const loader = new THREE.OBJLoader();
    const mtlLoader = new THREE.MTLLoader();

    mtlLoader.setTexturePath(routeFolder);
    mtlLoader.setPath(routeFolder);
    mtlLoader.load(nameArchive+'.mtl', function (materials) {

        materials.preload();

        loader.setMaterials(materials);
        loader.setPath(routeFolder);
        loader.load(nameArchive+'.obj', function (object) {
            dados[number] = object;
            scene.add(object);
            object.scale.set(scale,scale,scale);
            object.position.set(posx,posy,posz);
            object.rotation.y=rotation;
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
    requestAnimationFrame(animate);
    controls.update();
    
    renderer.render(scene, camera);
    
    if(rotate==true){
        dados[0].rotation.x -= SPEED * 2;
        dados[0].rotation.y -= SPEED;
        dados[0].rotation.z -= SPEED * 3;
        dados[1].rotation.x -= SPEED * 1;
        dados[1].rotation.y -= SPEED;
        dados[1].rotation.z -= SPEED * 2;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function playSounds(whatSound){
    switch(whatSound){

        case 'hollow':
            document.getElementById("myBackgroundSound").play();
            break;
       

        case 'background':
            document.getElementById("myBackgroundSound").play();
            break;

    }   
}

function go2Play() {
    // Agrega el event listener para seleccionar un jugador
    document.querySelector('#blocker').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            jugador = e.target.dataset.color;
            // Oculta el bloqueador
            document.getElementById('blocker').style.display = 'none';
            // Muestra la escena
            renderer.domElement.style.display = 'block';
            // Mueve la cámara al jugador seleccionado
            moveCameraToPlayer();
            // Inicia el temporizador
            initialiseTimer(1000);
        }
    });
    playSounds('hollow');
}



  
function initialiseTimer() {
    var sec = 0;
    function pad(val) { return val > 9 ? val : "0" + val; }
  
    setInterval(function () {
      document.getElementById("seconds").innerHTML = String(pad(++sec % 60));
      document.getElementById("minutes").innerHTML = String(pad(parseInt(sec / 60, 10)));
    }, 1000);
  }

  
var SPEED = 0.03;
function throwDices(caseMovement) {
    createObjMtl('./src/models/OBJMTL/Dice/','dice',-2,2.8,0, 1,0,0);
    createObjMtl('./src/models/OBJMTL/Dice/','dice',2,2.8,0, 1,0,1);

    switch (caseMovement) {
        case 'rotate':
            rotate = true;
        break;
    
        case 'stop':
            rotate = false;
        break;
    }
}

console.log(THREE);
