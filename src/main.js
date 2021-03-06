// ----------------------------
// Inicialización de Variables:
// ----------------------------
var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    clock = null,
    ambientLight=null,
    interval = 5000,
    container,
    camHolder;
var VspotLight=[];
var VHelpers=[];
var canmove=87;
var texture;
var sound1 = null,
    countPoints = null,
    modelPlay = null,
    modelWorld = null,
    light = null,
    figuresGeo = [],
    isVisible = true;
var dirLight;

var MovingCube          = null,
    collidableMeshList  = [],
    mesh = [],
    collectibleMeshList = [],
    lives               = 3,
    numberToCreate      = 11,
    cont = 0;

var color = new THREE.Color();
var gamewon = false;

var scale = 1;
var rotSpd = 0.05;
var spd    = 0.05;
var input  = {left:0,right:0, up: 0, down: 0};
var pickupCreated = null;
var modelpick = [];
var pickupNum = 0;
var posiblePos = [10,13,2,5,-5,1,15,1,16,-3,-13,-4,21,1];
var dxpos=0;
var dypos=0;

var posX = 3;
var posY = 0.5;
var posZ = 1;
var player = null;
var playerCreated = false;

var speedTrans = 20;
var speedRot = THREE.Math.degToRad(75);

var clock = new THREE.Clock();
var delta = 0;
const oro=["Collar_raro_feo", "Cosacalima", "figura_tairona"];

var
    hemisphereLight;
// ----------------------------
// Funciones de creación init:
// ----------------------------
function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
}

function onWindowResize() {
    // camera.aspect = (window.innerWidth-100) / (window.innerHeight-100);
    camera.aspect = (window.innerWidth) / (window.innerHeight)
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

function initScene() {
    initBasicElements(); // Scene, Camera and Render
    createLight();       // Create light
    initWorld();
    // createPlayerMove();
    // initGUI();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    delta = clock.getDelta();
    // MovingCube.rotation = camHolder.rotation;
    // MovingCube.position = camHolder.position;
    // movePlayer();
    collisionAnimate();
}

function createSculptures(){
    createPickUp(25,25,'alcarraza');
    createPickUp(-16,23,'Collar_raro_feo');
    createPickUp(-16,25,'copa');
    createPickUp(5,40,'Cosacalima');
    createPickUp(25,23,'figura_tairona');
}

function initBasicElements() {
    container = document.getElementById( 'canvas' );
    // console.log(container);
    document.body.appendChild( container );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(20, (window.innerWidth) / (window.innerHeight), 0.001, 100);
    renderer = new THREE.WebGLRenderer();
    // renderer.setSize( parseInt(container.style.width), parseInt(container.style.height) );
    renderer.setSize(window.innerWidth-1,window.innerHeight-1);
    container.appendChild( renderer.domElement );
    clock = new THREE.Clock();

    scene.background = new THREE.Color(0xdfdfdf);;
    scene.fog = new THREE.Fog(0xffffff, 0, 750);


    // camera.position.x = 0;
    // camera.position.y = 1.8;
    // camera.position.z = 0;

    camHolder = new THREE.Group();
    camHolder.add(camera);
    // camHolder.add(MovingCube);
    camHolder.position.set(5,1.7,5);
    // camHolder.rotation.y = (Math.PI / 2 + Math.PI / 2);
    createPlayerMove();
    scene.add(camHolder);
}


function createModel(generalPath, pathMtl, pathObj, whatTodraw) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(generalPath);
    mtlLoader.setPath(generalPath);
    mtlLoader.load(pathMtl, function(materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(generalPath);
        objLoader.load(pathObj, function(object) {
            scene.traverse(function(child){
                child.castShadow =  true;
                child.receiveShadow=true;
            });
            object.traverse(function(child){
                child.castShadow = true;
                child.receiveShadow=true;
            });
            
            scene.castShadow=true;
            scene.recieveShadow=true;
            console.log(scene);
            // world/player
            switch (whatTodraw) {
                case "world":
                    modelWorld = object;
                    object.scale.set(0.03, 0.03, 0.03);
                    object.position.y = 0;
                    object.position.x = 5;
                    object.material=new THREE.MeshStandardMaterial({

                    })
                    break;

                case "player":
                    modelPlay = object;
                    figuresGeo.push(modelPlay);

                    object.scale.set(0.005, 0.005, 0.005);
                    object.position.x = MovingCube.position.x;
                    object.position.y = MovingCube.position.y;
                    object.position.z = MovingCube.position.z;
                    object.rotation.y = Math.PI / 2 + Math.PI / 2;
                    player = object;
                    
                    scene.add(player);
                    playerCreated = true;
                    break;
            }
            scene.add(object);
        });

    });
}


function createLight() {
    // ambientLight=new THREE.AmbientLight( 0x0f0f0f ) // soft white light
    // scene.add( ambientLight );
    const ap=new THREE.AmbientLightProbe(0xf7f7f7,0.5)
    scene.add(ap);
    const hemiLight = new THREE.HemisphereLight( 0xC5AF98, 0x6E4B2E, 0.5 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );

    //

    dirLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -10, 4, -10 );
    dirLight.position.multiplyScalar( 30 );
    

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    const d = 5;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 20;
    dirLight.shadow.bias = - 1;

    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );

    scene.add( dirLight );
    // scene.add( dirLightHelper );
}

function initWorld() {
    createModel('../modelos/MuseoArreglado/', 'MuseoArreglado.mtl', 'MuseoArreglado.obj', 'world');
    createSculptures();
}

/**
 * Event listener de las teclas wasd para moverse
 */
document.addEventListener('keydown', function(evt) {
    // console.log(evt);
    
    if (evt.keyCode == canmove) {
      camHolder.translateZ(-speedTrans * delta);
      MovingCube.translateZ( -speedTrans * delta);
      
    } // w fast vorward
    if (evt.keyCode === 83) {
      camHolder.translateZ( speedTrans * delta);
      MovingCube.translateZ( speedTrans * delta);
    } 
  
    if (evt.keyCode === 65) {
      camHolder.rotateY(speedRot * delta);
      MovingCube.rotateY(speedRot * delta);
    } // l turn to the left
    if (evt.keyCode === 68) {
      camHolder.rotateY(-speedRot * delta);
      MovingCube.rotateY(-speedRot * delta);
    } // r turn to the right
  
    if (evt.keyCode === 84) {
      camHolder.translateY(speedTrans * delta);
      MovingCube.translateY(speedTrans * delta);
    } // t upstretch
    if (evt.keyCode === 66) {
      camHolder.translateY(-speedTrans * delta);
      MovingCube.translateY(-speedTrans * delta);
    } // b bend down
    if (evt.keyCode === 38) {
      camera.rotation.x += speedRot * delta;
    } // up arrow, looking higher
    if (evt.keyCode === 40) {
      camera.rotation.x += -speedRot * delta;
    } // down arrow, looking deeper
  
});

function createPickUp(xPos,zPos,name) {
    // create a geometry
    yPos=0.6;

    // if(name == 'figura_tairona'){
    //     yPos = 3;
    // }

    // if(name == 'Collar_raro_feo'){
    //     yPos = 4;
    // }
    const geometry = new THREE.BoxBufferGeometry( 2, 3, 2 );
    
    //  Create texture 
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:true, transparent: true, opacity: 0 });

    // create a Mesh
    mesh[pickupNum] = new THREE.Mesh( geometry, material );
    

    var randomIdentify = Math.floor(Math.random() * 101);
    mesh[pickupNum].name = cont;
    console.log(mesh[pickupNum].name);
    mesh[pickupNum].id   = "modelToPick"+randomIdentify;
    cont++;

    mesh[pickupNum].position.x = xPos;
    mesh[pickupNum].position.y = yPos;
    mesh[pickupNum].position.z = zPos;
    var spotLight = new THREE.SpotLight( 0xccc4a0 );
    spotLight.position.set( xPos, 4, zPos );

    spotLight.castShadow = true;
    spotLight.intensity=0.8;
    spotLight.distance=5;
    spotLight.angle=0.5;
    spotLight.prenumbra=1;
    spotLight.decay=1;
    spotLight.focus=0.5;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    spotLight.target=mesh[pickupNum];

    VspotLight.push(spotLight);
    scene.add( VspotLight[VspotLight.length-1] );
    var spotLightHelper = new THREE.SpotLightHelper( VspotLight[VspotLight.length-1] );
    VHelpers.push(spotLightHelper);
    // scene.add( VHelpers[VHelpers.length-1] );

    // add the mesh to the scene collisions object
    collectibleMeshList.push(mesh[pickupNum]);
    scene.add(mesh[pickupNum]);
    
    loadSculpture(pickupNum, xPos, zPos, name);
    loadSculpture(pickupNum, xPos, zPos, 'Pedestal');
    pickupNum++; 
}

function loadSculpture(pick, xPos, zPos, name){
  var mtlLoader = new THREE.MTLLoader();
  var objLoader = new THREE.OBJLoader();

  let goldmaterial = new THREE.MeshStandardMaterial( {
    metalness: 1,
    roughness: 0.1,
    emissive: 0x280101,
    emissiveIntensity: 0.3,
    envMapIntensity: 1.0,
    color: 0xdaa520
    } );
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

    mtlLoader.setResourcePath(`../modelos/${name}/`);
    mtlLoader.setPath(`../modelos/${name}/`);
    if(oro.includes(name)){
        objLoader.setPath(`../modelos/${name}/`);
        objLoader.load(`${name}.obj`, function ( object ) {
                    
            // geodesic = object; // reference doesnt work outside the function

            object.traverse(function(node) {
                node.material=goldmaterial;
                
                node.castShadow = true;
                node.receiveShadow = false;
                
            });
            object.material.envMap=texture;
            object.castShadow=true;
            object.position.x = xPos;
            object.position.y = 1.3;
            if(name == 'Pedestal'){
                object.position.y = 0;
            }
            if(name == 'Collar_raro_feo'){
                object.position.y = 1.65;
                object.rotation.y = -(Math.PI / 2)
            }
            if(name == 'figura_tairona'){
                object.position.y = 2.3;
                object.rotation.y = Math.PI / 2;
                object.scale.set(0.5, 0.5, 0.5);
            }
            // if(name == 'copa'){
            //     object.position.y = 1.9;
            //     // object.rotation.y = Math.PI / 2;
            //     object.scale.set(0.5, 0.5, 0.5);
            // }
            object.position.z = zPos;
            object.receiveShadow=true;
            modelpick[pick]=object;
            object.name = `sculpture`+pick;
            scene.add(object);
            // scene.add( new THREE.HemisphereLight( 0x443333, 0x222233, 4 ) );
        });
        
    }else{
        mtlLoader.load(`${name}.mtl`, function (materials) {
        
      
            materials.preload();
            
            objLoader.setMaterials(materials);
            objLoader.setPath(`../modelos/${name}/`);
            objLoader.load(`${name}.obj`, function (object) {
            name=='Pedestal'?object.scale.set(0.0115, 0.0115, 0.0115):object.scale.set(1,1,1);
            if(name=="copa") object.scale.set(0.3, 0.3, 0.3);
            object.position.x = xPos;
            object.position.y = 1.3;
            if(name == 'Pedestal'){
                object.position.y = 0;
            }
            // if(name=="copa") object.position.y=0;
            object.position.z = zPos;
            object.castShadow=true;
            object.receiveShadow=true;
            modelpick[pick]=object;
            object.name = `sculpture`+pick;
            console.log(object.name);
            scene.add(object);      
            });
        });
    } 
}

function createPlayerMove() {
    var cubeGeometry = new THREE.CubeGeometry(2,2,2);
    var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0});
    MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
    MovingCube.position.set(5,1.7,5);
    
    scene.add(MovingCube);
}

function collisionAnimate() {
    canmove=87;
    document.getElementById("alcarraza").style.display="none";
    document.getElementById("Collar_raro_feo").style.display="none";
    document.getElementById("copa").style.display="none";
    document.getElementById("Cosacalima").style.display="none";
    document.getElementById("figura_tairona").style.display="none";

    var originPoint = MovingCube.position.clone();

    for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
        var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
        var directionVector = globalVertex.sub(MovingCube.position);
        
        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        var collisionRCollect = ray.intersectObjects(collectibleMeshList);
        
        if (collisionRCollect.length > 0 && collisionRCollect[0].distance < directionVector.length()) {
            canmove=-1;

            var sculpture = (scene.getObjectByName('sculpture'+collisionRCollect[0].object.name));

            switch (sculpture.name) {
                case "sculpture0":
                    document.getElementById("alcarraza").style.display="block";
                    document.getElementById("Collar_raro_feo").style.display="none";
                    document.getElementById("copa").style.display="none";
                    document.getElementById("Cosacalima").style.display="none";
                    document.getElementById("figura_tairona").style.display="none";
        
                    break;
                case "sculpture1":
                    document.getElementById("Collar_raro_feo").style.display="block";
                    document.getElementById("alcarraza").style.display="none";
                    document.getElementById("copa").style.display="none";
                    document.getElementById("Cosacalima").style.display="none";
                    document.getElementById("figura_tairona").style.display="none";
        
                    break;
                case "sculpture2":
                    document.getElementById("copa").style.display="block";
                    document.getElementById("alcarraza").style.display="none";
                    document.getElementById("Collar_raro_feo").style.display="none";
                    document.getElementById("Cosacalima").style.display="none";
                    document.getElementById("figura_tairona").style.display="none";
        
                    break;
                case "sculpture3":
                    document.getElementById("Cosacalima").style.display="block";
                    document.getElementById("alcarraza").style.display="none";
                    document.getElementById("Collar_raro_feo").style.display="none";
                    document.getElementById("copa").style.display="none";
                    document.getElementById("figura_tairona").style.display="none";
        
                    break;
                case "sculpture4":
                    document.getElementById("figura_tairona").style.display="block";
                    document.getElementById("alcarraza").style.display="none";
                    document.getElementById("Collar_raro_feo").style.display="none";
                    document.getElementById("copa").style.display="none";
                    document.getElementById("Cosacalima").style.display="none";
        
                    break;
                default:
                    document.getElementById("alcarraza").style.display="none";
                    document.getElementById("Collar_raro_feo").style.display="none";
                    document.getElementById("copa").style.display="none";
                    document.getElementById("Cosacalima").style.display="none";
                    document.getElementById("figura_tairona").style.display="none";
        
                    break;
            }
        }
    }
}


