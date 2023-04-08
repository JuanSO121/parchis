var scene = null, 
    camera = null, 
    renderer = null, 
    myCanvas = null, 
    controls = null; 

function start3dService() {
    initScene();
    createpieces(); 
    animate(); 

    window.addEventListener( 'resize', onWindowResize, false );
}

function initScene() {
    scene = new THREE.Scene();
    scene.background=new THREE.Color(012075);
    camera = new THREE.PerspectiveCamera( 75,  
                                        window.innerWidth / window.innerHeight, 
                                        0.1,  
                                        1000 ); 

    myCanvas = document.querySelector('.webgl'); 
    renderer = new THREE.WebGLRenderer({canvas: myCanvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene.add(camera);
  
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(10, 15, 10);
    controls.update();

    const size = 30;
    const divisions = 30;

    const gridHelper = new THREE.GridHelper(size, 
                                            divisions,
                                            0x000, //color cruz
                                            0xffffff);
    scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper(5);
    scene.add( axesHelper );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
            scene.add( directionalLight );

    const textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('./src/img/mapa.png');

    const geometry = new THREE.PlaneGeometry(30, 30);
    const material = new THREE.MeshStandardMaterial( {color: 0xfffffff,
                                                        map: texture,
                                                        side: THREE.DoubleSide,
                                                        specular:0,
                                                        transparent: true,
                                                        blending: THREE.NormalBlending
                                                        } ); //THREE.MultiplyBlending, THREE.NormalBlending, THREE.AdditiveBlending, THREE.SubtractiveBlending
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function createpieces() {
  camera.position.z = 5;
 }

function animate() {
    controls.update();
	requestAnimationFrame( animate );
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