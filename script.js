
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
  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
  light.position.set( 0.5, 1, 0.75 );
//  scene.add( light );

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


  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
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

  var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

  var floor = new THREE.Mesh( floorGeometry, floorMaterial );
  scene.add( floor );

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


//  stats.update();
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




    if ( controls.getObject().position.x > 250) {
      velocity.x = 0;
      moveRight = false;
   }

    if ( controls.getObject().position.x < -250 ) {

      velocity.x = 0;
      moveLeft = false;
    }

    if ( controls.getObject().position.z < -400 ) {
      velocity.z = 0;
      moveForward = false;
   }
   if ( controls.getObject().position.z > 480 ) {
      velocity.z = 0;
      moveBackward = false;
    }





    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

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

function makeTemple(size,sizediff,hauteur,posx,posz){
  var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
  var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
  var geometry = new THREE.BoxBufferGeometry( size, hauteur, size );
  var base = new THREE.Mesh( geometry, material );
  base.position.set( posx, 0, posz );
  base.castShadow = true;
  baseTemple(1,base,size,sizediff,hauteur,posx,posz);

  var hypothenuse = Math.sqrt(Math.pow(hauteur * 9,2) + Math.pow(sizediff * 4,2));
  var geometry = new THREE.BoxBufferGeometry( 10, hypothenuse, size/6 );
  var rampe = new THREE.Mesh( geometry, material );
  rampe.position.set(posx + (size - (4*sizediff))/2, hauteur * 4, posz );
  var angle = Math.acos((sizediff * 4) / hypothenuse)- Math.PI/4 ;
  //	var angle = Math.acos((sizediff * 4) / hypothenuse)/2;
  rampe.rotation.set(0, 0, angle - 0.1);
  rampe.castShadow = true;
  escalierTemple(1,rampe,size,sizediff,hauteur,posx,posz);
  hautTemple(size,sizediff,hauteur,posx,posz);

}
function baseTemple(it,base,size,sizediff,hauteur,posx,posz){
  scene.add( base );
  if(it < 9){
    var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
    var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
    var geometry = new THREE.BoxBufferGeometry( size-sizediff, hauteur, size-sizediff );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( posx, hauteur * it, posz );
    mesh.castShadow = true;
    baseTemple(it+1,mesh,size-sizediff,sizediff,hauteur,posx,posz);
  }
}

function escalierTemple(it,rampe,size,sizediff,hauteur,posx,posz){
  scene.add( rampe );
  if(it < 4){
    var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
    var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
    var hypothenuse = Math.sqrt(Math.pow(hauteur * 9,2) + Math.pow(sizediff * 4,2));
    var geometry = new THREE.BoxBufferGeometry( 10, hypothenuse, size/6 );
    var mesh = new THREE.Mesh( geometry, material );
    if(it == 1){
      var x = (-size + (4*sizediff))/2 + posx;
      rotx = 0;
    }
    else if(it == 2){
      var x = posx;
      var rotx = Math.PI / 2;
      posz = (size - (4*sizediff))/2 + posz;
    }
    else{
      var x = posx;
      var rotx = -Math.PI / 2;
      posz = posz - size + sizediff * 4;
    }
    mesh.position.set(x, hauteur * 4, posz );
    var angle = Math.acos((sizediff * 4) / hypothenuse) - Math.PI/4 ;
    mesh.rotation.set(0, rotx, -angle + 0.1);
    mesh.castShadow = true;
    escalierTemple(it+1,mesh,size,sizediff,hauteur,posx,posz);
  }
}


function hautTemple(size,sizediff,hauteur,posx,posz){
  var texture = new THREE.TextureLoader().load('images/templeMousse.jpg');
  var material = new THREE.MeshPhongMaterial( { map: texture, dithering: true } );
  var geometry = new THREE.BoxBufferGeometry( size - (10 * sizediff), hauteur * 3, size - (10 * sizediff));
  var haut = new THREE.Mesh( geometry, material );
  haut.position.set( posx, hauteur * 9, posz );
  haut.castShadow = true;
  scene.add(haut);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
