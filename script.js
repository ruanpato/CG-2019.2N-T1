import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js";

import Stats from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/stats.module.js";
import { GUI } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/dat.gui.module.js";

import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js";
//import { SkeletonUtils } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples//jsm/utils/SkeletonUtils.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js";

var pickle, mew, fatPsyduck, bikini, spongeBob;
var container, clock, gui, mixer, actions, activeAction, controls, rayCaster;
var camera, scene, renderer, mew, light;

var controlPos = {x: 440, y: 197, z: 10}//, cameraPos = {x: 70, y: 40, z: 70};
var api = {Action: 'Static Pose'};
var pickleRoll = {RollX: false, RollY: false, RollZ: false}, rotation = {RollX: 0.0, RollY: 0.0, RollZ: 0.0};

const KEY ={
    W: 87,
    A: 65,
    S: 83,
    D: 68, 
    SHIFT:16,
    CTRL: 17
}


init();
animate();

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    var lookAtVector = new THREE.Vector3(0,0, -1);
    lookAtVector.applyQuaternion(camera.quaternion);
    switch(keyCode){
        case KEY.CTRL:
            controls.target.set(controlPos['x'], (controlPos['y']-=2), controlPos['z']);
            break;
        case KEY.SHIFT:
            controls.target.set(controlPos['x'], (controlPos['y']+=2), controlPos['z']);
            break;
        case KEY.A:
            controls.target.set((controlPos['x']-=2), controlPos['y'], controlPos['z']);
            break;
        case KEY.D:
            controls.target.set((controlPos['x']+=2), controlPos['y'], controlPos['z']);
            break;
        case KEY.S:
            controls.target.set(controlPos['x'], (controlPos['y']), (controlPos['z']-=2));
            break;
        case KEY.W:
            controls.target.set(controlPos['x'], (controlPos['y']), (controlPos['z']+=2));
            break;
    }
}

function init() {
    // Container "config"
    container = document.createElement('div');
    document.body.appendChild(container);
    document.addEventListener('keydown',onDocumentKeyDown,false);

    // To get clicked position
    rayCaster = new THREE.Raycaster();
    // Camera "config"
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 50000);
    camera.position.set(500, 297, 10);
    camera.lookAt(new THREE.Vector3(440, 197, 10));

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
    mesh.position.y = 0;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    

    // Add Grid (If removes get )
    /*var grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    */
    // load mew model
    loader = new GLTFLoader();
    // Load "Scenario"
    loader.load('models/bikini/scene.gltf', function ( gltf ) {
        bikini = gltf
        // Adding on scene object.scene
        bikini.scene.position.set(0, 130, 0);
        bikini.scene.scale.set(60, 60, 60);
        scene.add(bikini.scene);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    // Load SpongeBob undergraduate
    loader.load('models/spongeBob/scene.gltf', function ( gltf ) {
        spongeBob = gltf
        // Adding on scene object.scene
        spongeBob.scene.position.set(520, 140, -60);
        spongeBob.scene.scale.set(80, 80, 80);
        scene.add(spongeBob.scene);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    // Load pickle rick
    loader.load('models/pickle_rick/scene.glb', function ( gltf ) {
        pickle = gltf
        // Adding on scene object.scene
        pickle.scene.position.set(520, 127, 20);
        pickle.scene.scale.set(10, 10, 10);
        pickle.scene.rotateY(Math.PI/2);
        scene.add(pickle.scene);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    // Load fat Psyduck
    loader.load('models/fatPsyduck/scene.glb', function ( gltf ) {
        fatPsyduck = gltf
        // Adding on scene object.scene
        fatPsyduck.scene.position.set(-350, 294, 200);
        fatPsyduck.scene.scale.set(90, 90, 90);
        fatPsyduck.scene.rotateY(Math.PI/2);
        scene.add(fatPsyduck.scene);
    }, undefined, function ( e ) {
        console.error( e );
    } );
    // Mew load
    loader.load('models/mew/scene.glb', function ( gltf ) {
        // Adding on scene object.scene
        mew = gltf
        mew.scene.position.set(440, 197, 10);
        mew.scene.scale.set(0.4, 0.4, 0.4);
        mew.scene.rotateY(Math.PI/2);
        scene.add(mew.scene);
        // Create GUI
        createGUI(mew.scene, mew.animations);
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

    controls.target.set(controlPos['x'], controlPos['y'], controlPos['z']);
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
    var actionsNames = ['Static Pose'];
    for(var i = 0; i < animations.length; i++){
        var clip = animations[i];
        var action = mixer.clipAction(clip);
        
        if(clip.name != 'metarig|SunAction'){
            actionsNames[i+1] = clip.name;
            actions[clip.name] = action;
        }
        
    }
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;

    var actionsGUI = gui.addFolder('mew Actions');
    var actionSelect = actionsGUI.add(api, 'Action').options(actionsNames);
    actionSelect.onChange(function(){
        if(api['Action'] == 'Static Pose'){
            for(var key in actions){
                activeAction = actions[key];
                activeAction.stop();
            }
        }else{
            actions[api['Action']].play()
        }
    });
    
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
        pickle.scene.rotateX( 0.1 )
    if(pickleRoll['RollY'] == true)
        pickle.scene.rotateY( 0.1 )
    if(pickleRoll['RollZ'] == true)
        pickle.scene.rotateZ( 0.1 )

    var deltaSeconds = clock.getDelta();
    if ( mixer ) mixer.update( deltaSeconds );
    controls.update(deltaSeconds);
    requestAnimationFrame( animate );
    
    renderer.render( scene, camera );
}