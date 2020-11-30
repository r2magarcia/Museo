let container, stats;
let camera, scene, renderer, controls;
let figura, planeMesh;
let pngCubeRenderTarget, exrCubeRenderTarget;
let pngBackground, exrBackground;
const oro=["Collar_raro_feo", "Cosacalima", "figura_tairona"];

// const params = {
//     envMap: 'EXR',
//     roughness: 0.0,
//     metalness: 0.0,
//     exposure: 1.0,
//     debug: false,
// };



// init();


function init(name) {

    container = document.getElementById( 'canvas' );
    document.body.appendChild( container );


    camera = new THREE.PerspectiveCamera(60, (window.innerWidth) / (window.innerHeight), 0.0001, 20);
    camera.position.set( 0, 1, 1.5 );

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();

    console.log("aiuda");

    texture = new THREE.CubeTextureLoader()
	.setPath( '../img/' )
	.load( [
		'equirectangular.png',
		'equirectangular.png',
		'equirectangular.png',
		'equirectangular.png',
		'equirectangular.png',
		'equirectangular.png'
    ] );
    

    // let geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );

       

    geometry = new THREE.PlaneBufferGeometry( 10, 10 );
    material = new THREE.MeshStandardMaterial({
        color: 0x999999
    });

    planeMesh = new THREE.Mesh( geometry, material );
    planeMesh.position.y = -0;
    planeMesh.rotation.x = - Math.PI * 0.5;
    planeMesh.castShadow=true;
    planeMesh.recieveShadow=true;
    // scene.add( planeMesh );
    

    renderer.setSize(window.innerWidth,window.innerHeight);
    container.appendChild( renderer.domElement );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    scene.background = new THREE.Color(0xdfdfdf);;
    scene.fog = new THREE.Fog(0xffffff, 0, 750);
    loadSculpture(name);
    createLights();

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
    
}

function onWindowResize() {
    camera.aspect = (window.innerWidth) / (window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

function animate() {
    
    requestAnimationFrame( animate );
    render();
}

function render() {

    if(figura){
        figura.rotation.y += 0.005;
        // camera.lookAt(figura);
    }
    renderer.render( scene, camera );

}

function loadSculpture(name){

    let goldmaterial = new THREE.MeshStandardMaterial( {
        metalness: 1,
        roughness: 0.1,
        emissive: 0x280101,
        emissiveIntensity: 0.3,
        envMapIntensity: 1.0,
        color: 0xdaa520
    } );

    let mtlLoader = new THREE.MTLLoader();
    let objLoader = new THREE.OBJLoader();
    objLoader.setPath(`../modelos/${name}/`);

    if(oro.includes(name)){
        objLoader.load(`${name}.obj`, function ( object ) {

            object.traverse(function(node) {
                node.material=goldmaterial;
            });
            // object.scale.set(0.03, 0.03, 0.03);
            figura=object;
            // figura.scale.set(50,50,50);
            figura.position.set(0,-0.6,0)
            figura.material.envMap=texture;
            figura.castShadow=true;
            figura.recieveShadow=true;
            scene.add(figura);
        }); 
    }else{
        mtlLoader.setResourcePath(`../modelos/${name}/`);
        mtlLoader.setPath(`../modelos/${name}/`);
        mtlLoader.load(`${name}.mtl`, function (materials) {
          
          materials.preload();
          
          
          objLoader.load(`${name}.obj`, function (object) {
          object.scale.set(1,1,1);
          object.position.x = 0;
          object.position.y = -0.2;
          object.position.z = 0;
          object.castShadow=true;
          object.recieveShadow=true;
          scene.add(object);
          object.name = `${name}`;
    
            });
            objLoader.setMaterials(materials);
        });
    }
}
function createLights() {
    scene.castShadow=true;
    scene.recieveShadow=true;
    scene.traverse(function(node){
        node.castShadow=true;
        node.recieveShadow=true;
    });
    console.log(scene);
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
