function skyBox(){
  var geometry = new THREE.CubeGeometry( 80000, 80000, 80000);
  var cubeMaterials =
  [ //On peut mettre DoubleSide
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/right.png' ), side:THREE.BackSide } ), // droite
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/left.png' ), side:THREE.BackSide } ), // gauche
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/top.png' ), side:THREE.BackSide } ), // haut
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/bottom.png' ), side:THREE.BackSide } ), // bas
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/back.png' ), side:THREE.BackSide } ), // arriere
    new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader( ).load( 'images/Skybox-WebGL/interstellar/front.png' ), side:THREE.BackSide } ) // face
  ];
  var cubeMaterial = new THREE.MeshBasicMaterial( cubeMaterials );
  var skybox = new THREE.Mesh ( geometry, cubeMaterials );
  scene.add( skybox );
}

function makeFloor(path,size,finalSize){
  var floorGeometry = new THREE.PlaneBufferGeometry(size, size);
  floorGeometry.rotateX( - Math.PI / 2 );
  var floorTexture = new THREE.TextureLoader().load(path);
  var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, dithering: true } );
  var floor = new THREE.Mesh( floorGeometry, floorMaterial );
  floor.receiveShadow = true;

  var i;
  var j;
  for(j = 0; j*size < finalSize/2;j++)
  {
    for(i = 0;i*size < finalSize/2;i++){
      var flooor = floor.clone();
      flooor.position.set(size*i,0,j*size);
      scene.add(flooor);
    }
    for(i = 0;i*size < finalSize/2;i++){
      var flooor = floor.clone();
      flooor.position.set(-size*i,0,j*size);
      scene.add(flooor);
    }
  }
  for(j = 0; j*size < finalSize/2;j++)
  {
    for(i = 0;i*size < finalSize/2;i++){
      var flooor = floor.clone();
      flooor.position.set(size*i,0,j*-size);
      scene.add(flooor);
    }
    for(i = 0;i*size < finalSize/2;i++){
      var flooor = floor.clone();
      flooor.position.set(-size*i,0,j*-size);
      scene.add(flooor);
    }
  }
}
