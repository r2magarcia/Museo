let renderer;
let scene;
let camera;
let controls;
 

function start(){
    
    container = document.getElementById( 'canvas' );
    // console.log(container);
    document.body.appendChild( container );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, (window.innerWidth-100) / (window.innerHeight-100), 0.0001, 3);
    renderer = new THREE.WebGLRenderer();
    // renderer.setSize( parseInt(container.style.width), parseInt(container.style.height) );
    renderer.setSize(window.innerWidth-100,window.innerHeight-100);
    container.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    scene.background = new THREE.Color(0xdfdfdf);;
    scene.fog = new THREE.Fog(0xffffff, 0, 750);
    

    camera.position.set( 1, 1, 1 );

    loadSculpture('Collar_raro_feo')

    createLights();
    // controls.update() 
    // controls.update();
    animate();
}

function loadSculpture(name){
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(`../modelos/${name}/`);
    mtlLoader.setPath(`../modelos/${name}/`);
    mtlLoader.load(`${name}.mtl`, function (materials) {
      
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(`../modelos/${name}/`);
      objLoader.load(`${name}.obj`, function (object) {
      object.scale.set(1,1,1);
      object.position.x = 0;
      object.position.y = -0.2;
      object.position.z = 0;
      object.castShadow=true;
      scene.add(object);
      object.name = `${name}`;

        });

    });
}

function createLights() {
    console.log("deberia crear las luces")
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );

    const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    scene.add( hemiLightHelper );

    //

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    scene.add(dirLight);
}


function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    camera.lookAt(0,0.2,0);

	renderer.render( scene, camera );

}