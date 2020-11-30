let container, stats;
let camera, scene, renderer, controls;
let figura, planeMesh;
let pngCubeRenderTarget, exrCubeRenderTarget;
let pngBackground, exrBackground;

// const params = {
//     envMap: 'EXR',
//     roughness: 0.0,
//     metalness: 0.0,
//     exposure: 1.0,
//     debug: false,
// };



// init();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, 0, 3 );

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
    
    scene.background=texture;

    // let geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );
    let goldmaterial = new THREE.MeshStandardMaterial( {
        metalness: 0.90,
        roughness: 0.1,
        envMapIntensity: 1.0,
        color: 0xdaa520
    } );
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('../modelos/Cosacalima/');
    console.log("comienza carga");
    objLoader.load(`Cosacalima.obj`, function ( object ) {
        
        // geodesic = object; // reference doesnt work outside the function
        console.log("asignacion de materiales");
        object.traverse(function(node) {
            node.material=goldmaterial;
        });
        // object.scale.set(0.03, 0.03, 0.03);
        figura=object;
        // figura.scale.set(50,50,50);
        figura.position.set(0,-0.2,0)
        figura.material.envMap=texture;
        scene.add(figura);
        scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );
        scene.add( new THREE.DirectionalLight( 0xffffff, 0.5 ))
        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 1000, 100 );

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        scene.add( spotLight );
    });
    // figura = new THREE.Mesh( geometry, material );
    

    geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    material = new THREE.MeshBasicMaterial();

    planeMesh = new THREE.Mesh( geometry, material );
    planeMesh.position.y = - 50;
    planeMesh.rotation.x = - Math.PI * 0.5;
    scene.add( planeMesh );
    // console.log(figura);
    // scene.add( figura );
    // const pmremGenerator = new THREE.PMREMGenerator( renderer );
    // pmremGenerator.compileEquirectangularShader();

    // THREE.DefaultLoadingManager.onLoad = function ( ) {

    //     pmremGenerator.dispose();

    // };
    
    new THREE.TextureLoader().load( '../img/equirectangular.png', function ( texture ) {

        texture.encoding = THREE.sRGBEncoding;

        // pngCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );

        // pngBackground = pngCubeRenderTarget.texture;

        texture.dispose();

    } );

    

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // stats = new Stats();
    // container.appendChild( stats.dom );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 0.5;
    controls.maxDistance = 10;

    window.addEventListener( 'resize', onWindowResize, false );

    // const gui = new GUI();

    // gui.add( params, 'envMap', [ 'EXR', 'PNG' ] );
    // gui.add( params, 'roughness', 0, 1, 0.01 );
    // gui.add( params, 'metalness', 0, 1, 0.01 );
    // gui.add( params, 'exposure', 0, 2, 0.01 );
    // gui.add( params, 'debug', false );
    // gui.open();
    animate();
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

}

function animate() {

    requestAnimationFrame( animate );

    // stats.begin();
    render();
    // stats.end();

}

function render() {

    // figura.material.roughness = params.roughness;
    // figura.material.metalness = params.metalness;

    // let newEnvMap = figura.material.envMap;
    // console.log(figura);
    let background = scene.background;

    // switch ( params.envMap ) {

    //     case 'EXR':
    //         newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
    //         background = exrBackground;
    //         break;
    //     case 'PNG':
    //         newEnvMap = pngCubeRenderTarget ? pngCubeRenderTarget.texture : null;
    //         background = pngBackground;
    //         break;

    // }

    // if ( newEnvMap !== figura.material.envMap ) {

    //     figura.material.envMap = newEnvMap;
    //     figura.material.needsUpdate = true;

    //     planeMesh.material.map = newEnvMap;
    //     planeMesh.material.needsUpdate = true;

    // }

    if(figura)figura.rotation.y += 0.005;
    // planeMesh.visible = params.debug;

    scene.background = background;
    // renderer.toneMappingExposure = params.exposure;

    renderer.render( scene, camera );

}
