import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js";

import Stats from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/stats.module.js";
import { GUI } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/dat.gui.module.js";

import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js";
//import { SkeletonUtils } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples//jsm/utils/SkeletonUtils.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js";

var pickle, charizard;
var container, stats, clock, gui, mixer, actions, activeAction, previousAction, controls;
var camera, scene, renderer, charizard, face, light;

var cameraOrbitVision = {charizard: true, pickle: false};
var api = {Action: 'Take 01'};
var pickleRoll = {RollX: false, RollY: false, RollZ: false}, rotation = {RollX: 0.0, RollY: 0.0, RollZ: 0.0};

init();
animate();
function init() {
    // Container "config"
    container = document.createElement('div');
    document.body.appendChild(container);
    //document.addEventListener('keydown', ondDocumentKeyDown, false);

    // Camera "config"
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(70, 40, 70);
//    camera.lookAt(new THREE.Vector3(0, 2, 0));

    // Scene "config"
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    //scene.fog = new THREE.Fog(0x87ceeb, 20, 10);

    clock = new THREE.Clock();
    
    // Light "config"
        // Hemisphere light
    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);
        // Direction light
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);
    var loader = new THREE.TextureLoader();
    // ground define
    var groundTexture = loader.load('textures/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;
    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    

    // Add Grid (If removes get )
    /*var grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    */
    // load Charizard model
    loader = new GLTFLoader();
    loader.load('models/charizard/scene.glb', function ( gltf ) {
        // Adding on scene object.scene
        charizard = gltf
        charizard.scene.position.set(-10, 0, -10);
        charizard.scene.scale.set(0.4, 0.4, 0.4);
        scene.add(charizard.scene);
        // Create GUI
        createGUI(charizard.scene, charizard.animations);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    // Load pickle rick
    loader.load('models/pickle_rick/scene.glb', function ( gltf ) {
        pickle = gltf
        // Adding on scene object.scene
        pickle.scene.position.set(35, 10, 0);
        pickle.scene.scale.set(1, 1, 1);
        scene.add(pickle.scene);
    }, undefined, function ( e ) {
        console.error( e );
    } );


    // Renderer "Config"
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;

    controls.target.set(-10, 10, -10);
    controls.enablePan = false;

    // Adding renderer
    container.appendChild( renderer.domElement );
    // Event Listener
    window.addEventListener( 'resize', onWindowResize, false );
}

function createGUI(model, animations){
    gui = new GUI();
    mixer = new THREE.AnimationMixer(model);
    actions = {}
    var actionsNames = ['Stopped', 'Take 01']
    for(var i = 0; i < animations.length; i++){
        var clip = animations[i];
        var action = mixer.clipAction(clip);
        actions[clip.name] = action;
        actions[i] = clip.name;
    }
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;

    var actionsGUI = gui.addFolder('Charizard Actions');
    var actionSelect = actionsGUI.add(api, 'Action').options(actionsNames)
    
    actionSelect.onChange(function(){

        activeAction = actions[api['Action']]
        if(activeAction != actions['Take 01'])
            actions['Take 01'].stop();
        else
            activeAction.play()
    });

    actionsGUI.open();

    activeAction = actions['Take 01'];
    if(activeAction != actions['Take 01'])
        activeAction.stop();
    activeAction.play();

    // pickle
    actionsGUI = gui.addFolder('Pickle Roll');
    activeAction = actionsGUI.add(pickleRoll, 'RollX');
    activeAction = actionsGUI.add(pickleRoll, 'RollY');
    activeAction = actionsGUI.add(pickleRoll, 'RollZ');

}

//
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//
function animate() {
    // Pickle rotation
    if(pickleRoll['RollX'] == true)
        pickle.scene.rotateX( (rotation['RollX'] += 0.01) )
    if(pickleRoll['RollY'] == true)
        pickle.scene.rotateY( (rotation['RollY'] += 0.01) )
    if(pickleRoll['RollZ'] == true)
        pickle.scene.rotateZ( (rotation['RollZ'] += 0.01) )

    var deltaSeconds = clock.getDelta();
    if ( mixer ) mixer.update( deltaSeconds );
    controls.update(dt)
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}