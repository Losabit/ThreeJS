if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var renderer, scene, camera;
var spotLight, lightHelper, shadowCameraHelper;
var gui;

function init() {
  var container = document.getElementById( 'container' );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 50000 );
  camera.position.set( 600,600, 0 );
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 20;
  controls.maxDistance = 3000;
  controls.enablePan = false;
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
  makeTemple(300,20,30,-120,180);
  stats = new Stats();
  container.appendChild( stats.dom );
  controls.target.copy( mesh.position );
  controls.update();
  window.addEventListener( 'resize', onResize, false );
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

function render() {
  renderer.render( scene, camera );
}

/*
function buildGui() {
  gui = new dat.GUI();
  var params = {
    'light color': spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay
  };
  gui.addColor( params, 'light color' ).onChange( function ( val ) {
    spotLight.color.setHex( val );
    render();
  } );
  gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
    spotLight.intensity = val;
    render();
  } );
  gui.add( params, 'distance', 50, 2000 ).onChange( function ( val ) {
    spotLight.distance = val;
    render();
  } );
  gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
    spotLight.angle = val;
    render();
  } );
  gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
    spotLight.penumbra = val;
    render();
  } );
  gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {
    spotLight.decay = val;
    render();
  } );
  gui.open();
}

*/

init();
//	buildGui();
render();
animate();
