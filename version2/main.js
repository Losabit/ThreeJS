
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var camera, scene, renderer, controls;
var spotLight, lightHelper, shadowCameraHelper;
var waterFall;
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

  var loadingManager = new THREE.LoadingManager( function () {
    scene.add( waterFall );
  } );
  // collada
  var loader = new THREE.ColladaLoader( loadingManager );
  loader.load('collada/tree1.dae', function ( collada ) {
    waterFall = collada.scene;
  } );

    var loader = new THREE.ObjectLoader();
    loader.load("waterFall.dae",
        function ( obj ) {
            obj.scale.set(1000,1000,1000);
            obj.position.x += 20;
            obj.position.y += 20;
            obj.position.z+= 20;
  //          obj.rotation.y += 0;
            obj.castShadow = true;
            obj.receiveShadow = true;
            scene.add( obj );
            objects.push(obj);

        },
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        function ( xhr ) {
            console.error( 'An error happened' );
        }
    );

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

  // floor

  var floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  floorGeometry.rotateX( - Math.PI / 2 );

  for ( var i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
    var face = floorGeometry.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }

  var floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture } );
  var floor = new THREE.Mesh( floorGeometry, floorMaterial );
  scene.add( floor );
  skyBox();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function makeSun(posx, posy, posz){
  var texture = new THREE.TextureLoader().load('images/sun.jpg');
  var geometry = new THREE.SphereBufferGeometry(200, 200, 200);
  var material = new THREE.MeshPhongMaterial({ map: texture});
  meshSun = new THREE.Mesh(geometry, material);
  meshSun.position.set(posx, posy, posz);
  scene.add(meshSun);

  spotLightSun = new THREE.SpotLight( 0xffffff, 2 );
  spotLightSun.position.set( posx, posy, posz );
  spotLightSun.angle = Math.PI / 4;
  spotLightSun.penumbra = 0.05;
  spotLightSun.decay = 2;
  spotLightSun.distance = 5000;
  spotLightSun.castShadow = true;
  spotLightSun.shadow.mapSize.width = 1024;
  spotLightSun.shadow.mapSize.height = 1024;
  spotLightSun.shadow.camera.near = 10;
  spotLightSun.shadow.camera.far = 200;
  scene.add( spotLightSun );
}
function makeMoon(posx, posy, posz){
  var texture = new THREE.TextureLoader().load('images/moon.jpg');
  var geometry = new THREE.SphereBufferGeometry(200, 200, 200);
  var material = new THREE.MeshPhongMaterial({ map: texture});
  meshMoon = new THREE.Mesh(geometry, material);
  meshMoon.position.set(posx, posy, posz);
  scene.add(meshMoon);

  spotLightMoon = new THREE.SpotLight( 0xffffff, 0.5 );
  spotLightMoon.position.set( posx, posy, posz );
  spotLightMoon.angle = Math.PI / 4;
  spotLightMoon.penumbra = 0.05;
  spotLightMoon.decay = 2;
  spotLightMoon.distance = 5000;
  spotLightMoon.castShadow = true;
  spotLightMoon.shadow.mapSize.width = 1024;
  spotLightMoon.shadow.mapSize.height = 1024;
  spotLightMoon.shadow.camera.near = 10;
  spotLightMoon.shadow.camera.far = 200;
  scene.add( spotLightMoon );
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

    if(Math.sin(t*0.01) > 0.4)
    {
      hemiLight.intensity = Math.sin(t* 0.01);
    }
    else
    {
      hemiLight.intensity = 0.4;
    }

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
        velocity.x-= velocity.x *10 *(controller.speed);
        velocity.y-= 9.8 * 100 *(controller.speed);
        velocity.z -= velocity.z*10 * (controller.speed);


      });



  gui.open();
}
buildGui();
