
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var camera, scene, renderer, controls;
var spotLight, lightHelper, shadowCameraHelper;
var gui;
var objects = [];
var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
  var element = document.body;
  var pointerlockchange = function ( event ) {
    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

      controlsEnabled = true;
      controls.enabled = true;

      blocker.style.display = 'none';
    } else {
      controls.enabled = false;

      blocker.style.display = 'block';

      instructions.style.display = '';
    }
  };
  var pointerlockerror = function ( event ) {

    instructions.style.display = '';
  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener( 'click', function ( event ) {

    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    element.requestPointerLock();

  }, false );

} else {

  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();
animate();

var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();

function init() {

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  //scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

// -----------------------------------------------------------

  var container = document.getElementById( 'container' );


//  renderer.shadowMap.enabled = true;
//  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//  renderer.gammaInput = true;
//  renderer.gammaOutput = true;


  makeSun(2000,1000,2000);
  makeMoon(2000,-1000,-2000);

  //////////////////// partie Audio //////////////////
  var listener = new THREE.AudioListener();
camera.add( listener );


var sound = new THREE.PositionalAudio( listener );
var soundf1 = new THREE.PositionalAudio( listener );
var soundf2 = new THREE.PositionalAudio( listener );
var soundf3 = new THREE.PositionalAudio( listener );


var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'song/monkey.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
  sound.setRefDistance( 2 );
	sound.setVolume( 0.1 );
	sound.play();
});
audioLoader.load( 'song/feut2.ogg', function( buffer ) {
	soundf1.setBuffer( buffer );
	soundf1.setLoop( true );
  soundf1.setRefDistance( 2 );
	soundf1.setVolume( 2 );
	soundf1.play();
  soundf2.setBuffer( buffer );
	soundf2.setLoop( true );
  soundf2.setRefDistance( 2 );
	soundf2.setVolume(2 );
	soundf2.play();
  soundf3.setBuffer( buffer );
	soundf3.setLoop( true );
  soundf3.setRefDistance( 2 );
	soundf3.setVolume( 2 );
	soundf3.play();
});

  var loadingManager = new THREE.LoadingManager( function () {
    tree.scale.set(1,1,1);
    tree.position.set(-100,0,400);
    tree.castShadow = true;
    tree.receiveShadow = true;
    scene.add( tree );
    plant.scale.set(0.2,0.2,0.2);
    scene.add( plant );
    treee = tree.clone();
    treee.position.set(200,0,-600);
    scene.add( treee );

    tree2 = tree.clone();
    tree2.position.set(800,0,250);
    scene.add( tree2 );

    tree3 = tree.clone();
    tree3.position.set(-800,0,100);
    scene.add( tree3 );

    tree4 = tree.clone();
    tree4.position.set(-550,0,-650);
    scene.add( tree4 );
    //creation de la torche et de ses clones
    torch.scale.set(0.5,0.5,0.5);
    torch.position.set(-20,0,-180);
    torch.castShadow = true;
    torch.receiveShadow = true;
    scene.add( torch );


    torch1 = torch.clone();
    torch1.position.set(-20,0,-300);
    scene.add( torch1 );
    torch1.add(soundf2);

    torch2 = torch.clone();
    torch2.position.set(210,0,-70);
    scene.add( torch2 );
    torch2.add(soundf3);

    torch3 = torch.clone();
    torch3.position.set(95,0,-70);
    scene.add( torch3 );
    torch3.add(soundf1);
    //creation du paresseux
    sloth.scale.set(1,1,1);
    sloth.position.set(-200,0,-180);
    sloth.castShadow = true;
    sloth.receiveShadow = true;
    scene.add( sloth );
    //creation des singes
    monkey.scale.set(1.2,1.2,1.2);
    monkey.position.set(-200,0,-250);
    monkey.castShadow = true;
    monkey.receiveShadow = true;
    scene.add( monkey );
    monkey.add(sound);
  } );

  var loader = new THREE.ColladaLoader( loadingManager );
  loader.load('collada/tree1.dae', function ( collada ) {
    tree = collada.scene;
  } );
  loader.load('collada/plant.dae', function ( collada ) {
    plant = collada.scene;
  } );
  loader.load('collada/torch.dae', function ( collada ) {
    torch = collada.scene;
  } );
  loader.load('collada/sloth.dae', function ( collada ) {
    sloth = collada.scene;
  });

  loader.load('collada/monkey.dae', function ( collada ) {
    monkey = collada.scene;
  } );

  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
  scene.add( hemiLight );
  var material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
  var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, - 20, 0 );
  mesh.rotation.x = - Math.PI * 0.5;
  mesh.receiveShadow = true;
  scene.add( mesh );
  makeTemple(300,20,30,160,-250);

  stats = new Stats();
  container.appendChild( stats.dom );
//  controls.target.copy( mesh.position );
//  controls.update();

// -----------------------------------------------------------

  var onKeyDown = function ( event ) {
    switch ( event.keyCode ) {
      case 38: // up
      case 90: // z
      case 15:
        moveForward = true;
        break;

      case 37: // left
      case 81: // q
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;

    }
  };

  var onKeyUp = function ( event ) {
    switch( event.keyCode ) {
      case 38: // up
      case 90: // z
      case 15:
        moveForward = false;
        break;

      case 37: // left
      case 81: // q
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );
  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
  makeFloor('images/floor3.jpg',100,2000);
  skyBox();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

var t = 0;

function animate() {
  requestAnimationFrame( animate );
  stats.update();
  t += 0.1;
  if(t > 0){
    meshSun.position.y = 1000*Math.sin(t * 0.01);
    meshSun.position.z = 1000*Math.cos(t * 0.01);
    spotLightSun.position.y = 1000*Math.sin(t* 0.01);
    spotLightSun.position.z = 1000*Math.cos(t * 0.01);
    meshMoon.position.y = -1000*Math.sin(t * 0.01);
    meshMoon.position.z = -1000*Math.cos(t * 0.01);
    spotLightMoon.position.y = -1000*Math.sin(t* 0.01);
    spotLightMoon.position.z = -1000*Math.cos(t * 0.01);

    if(-1000*Math.sin(t * 0.01) > 50){
      hemiLight.intensity = 0.3;
    }
    else{
      hemiLight.intensity = Math.sin(t* 0.01);
    }

    /*
    if(Math.sin(t*0.01) > 0.4)
    {
      hemiLight.intensity = Math.sin(t* 0.01);
    }
    else
    {
      hemiLight.intensity = 0.4;
    }
    */

  }

  if ( controlsEnabled === true ) {
    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;
    var intersections = raycaster.intersectObjects( objects );
    var onObject = intersections.length > 0;
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000; //C'est ici qu'on change la vitesse de déplacement
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveLeft ) - Number( moveRight );
    direction.normalize(); // this ensures consistent movements in all directions

    if (controls.getObject().position.x > 250) {
      velocity.x = 0;
      moveRight = false;
    }
    if (controls.getObject().position.x < -250) {
      velocity.x = 0;
      moveLeft = false;
    }
    if (controls.getObject().position.z < -400) {
      velocity.z = 0;
      moveForward = false;
    }
    if (controls.getObject().position.z > 480) {
      velocity.z = 0;
      moveBackward = false;
    }
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
    if ( onObject === true ) {
      velocity.y = Math.max( 0, velocity.y );
      canJump = true;
    }
    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    if ( controls.getObject().position.y < 10 ) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;
    }
    prevTime = time;
  }
  renderer.render( scene, camera );
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
var controller = new function() {

     this.positionX = 0;
     this.positionY = 0;
     this.positionZ = 0;
     this.position2X = 0;
     this.position2Y = 0;
     this.position2Z = 0;
     this.speed = 0;


   }();

function buildGui() {
  gui = new dat.GUI();
  var f2 = gui.addFolder('Position Lune');
     f2.add(controller, 'positionX', -2000, 2000).onChange( function() {
        meshMoon.position.x = (controller.positionX);
     });
     f2.add(controller, 'positionY', -1000, 1000).onChange( function() {
        meshMoon.position.y = (controller.positionY);
     });
     f2.add(controller, 'positionZ', -2000, 2000).onChange( function() {
        meshMoon.position.z = (controller.positionZ);
     });
     var f3 = gui.addFolder('Position Soleil');
    f3.add(controller, 'position2X', -2000, 2000).onChange( function() {
      meshSun.position.x = (controller.position2X);
    });
    f3.add(controller, 'position2Y', -1000, 1000).onChange( function() {
      meshSun.position.y = (controller.position2Y);
    });
    f3.add(controller, 'position2Z', -2000, 2000).onChange( function() {
      meshSun.position.z = (controller.position2Z);
    });
    var f1 = gui.addFolder('Cycle Jour/Nuit');
      f1.add(controller,'speed',0.01,1).onChange(function(){
        velocity.x += velocity.x *10 *(controller.speed);
        velocity.y += 9.8 * 100 *(controller.speed);
        velocity.z += velocity.z*10 * (controller.speed);


      });



  gui.open();
}
buildGui();
